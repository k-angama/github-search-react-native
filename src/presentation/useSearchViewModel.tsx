import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { searchUserRepository } from "./di/SearchDI";
import { UserEntity } from "../domain/UserEntity";
import { SearchUserRepository } from "../domain/SearchUserRepository";
import { RateLimitError } from "../data/RateLimitError";

interface SearchViewModelParams {
    repository?: SearchUserRepository;
    debounceDelay?: number;
    initialUsers?: UserEntity[];
}

const generateUniqueId = () => {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    };

export function useSearchViewModel({
    repository = searchUserRepository, 
    debounceDelay = 500,
    initialUsers = []
}: SearchViewModelParams = {}) {

    const [usersData, setUsersData] = useState<UserEntity[]>(initialUsers);
    const [selectedIds, setSelectedIds] = useState<string[]>([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resetDate, setResetDate] = useState<Date | null>(null);
 
    const debounceRef = useRef<number | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);


    /**
     * Cleanup function for unmount
     */
    useEffect(() => {
        const localAbortController = abortControllerRef.current;
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            if (localAbortController) {
                localAbortController.abort();
            }
        };
    }, []);

    /**
     * Computed values for selection state
     */
    const isAllItemSelected = useMemo(() => {
        return usersData.length > 0 && selectedIds.length === usersData.length;
    }, [usersData, selectedIds]);

    const isSomeItemSelected = useMemo(() => {
        return selectedIds.length > 0 && !isAllItemSelected;
    }, [selectedIds, isAllItemSelected]);
    
    /**
     * Immediate fetch without debouncing
     * Handles race conditions and proper error handling
     */
    const fetchDataImmediate = useCallback(async (query: string) => {

        // Cancel previous request if exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        if (query.length < 3) {  // Minimum length check
            setUsersData([]);
            setLoading(false);
            return;
        }

        if (!query.trim()) {
            setUsersData([]);
            setLoading(false);
            return;
        }

        abortControllerRef.current = new AbortController();

        setLoading(true);
        setError(null);  
        try {
            const data = await repository.searchUser(query, abortControllerRef.current.signal);
            setUsersData(data);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            console.error('[useSearchViewModel] Fetch failed:', errorMessage);

            if (e instanceof RateLimitError) {
                setResetDate(e.resetDate);
                setError(e.message);
            } else if (errorMessage !== 'Aborted') {
                setError('Unable to fetch users. Please try again.');
            }
            
        } finally {
            setLoading(false);
        }
    }, [repository]);

    /**
     * Debounced search function
     * Delays API calls until user stops typing
     */
    const fetchData = useCallback((query: string, fakeDate?: Date) => {

        // Check rate limit BEFORE debouncing
        const now = fakeDate ?? new Date();
        if(resetDate && (now < resetDate)) {
            setError(`Rate limit exceeded. Try again at ${resetDate.toLocaleTimeString()}`);
            return;
        } else {
            setResetDate(null);
        }

        // Clear error when user can search again
        if (resetDate && (now >= resetDate)) {
            setResetDate(null);
            setError(null);
        }

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            fetchDataImmediate(query)
        }, debounceDelay)

    }, [resetDate, debounceDelay, fetchDataImmediate]);

    /**
     * Selects or deselects a single item by its ID.
     */
    const toggleSelection = (nodeId: string) => {
        setSelectedIds((prev) =>
            prev.includes(nodeId)
            ? prev.filter((id) => id !== nodeId) // remove if already selected
            : [...prev, nodeId] // add if not selected
        );
    }

    /**
     * Selects all available items.
     */
    const selectAll = () => {
        const allIds = usersData.map(user => user.nodeId);
        setSelectedIds(allIds);
    }

    /**
     * Clears all selected selectedIds.
     */
    const clearSelection = () => {
        setSelectedIds([]);
    }

    /**
     * Deletes all selected users
     */
    const deleteSelected = () => {
        setUsersData(prevUsers => prevUsers.filter(
            user => !selectedIds.includes(user.nodeId))
        );
        setSelectedIds([]); // clear selection
    };

    /**
     * Duplicates all selected users with new unique IDs
     */
    const duplicateSelected = (fakeGenerateId?: string) => {
        setUsersData(prevUsers => {
            const selectedUsers = prevUsers.filter(
                user => selectedIds.includes(user.nodeId)
            ); 

            // duplicate with new IDs
            const duplicates = selectedUsers.map(user => ({
                ...user,
                nodeId: `${ user.nodeId }-${ fakeGenerateId || generateUniqueId() }`,
            }));
 
            return [ ...duplicates, ...prevUsers];
        });
    };

    return { 
        // Data
        usersData,
        selectedIds,

        // Actions
        fetchData,
        toggleSelection,
        deleteSelected,
        duplicateSelected,
        selectAll, 
        clearSelection,

        // Computed state
        isAllItemSelected,
        isSomeItemSelected,

        // Loading & error state
        loading,
        error
    }

}