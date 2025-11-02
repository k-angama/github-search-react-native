import { renderHook, act } from '@testing-library/react-native';
import { useSearchViewModel } from '../src/presentation/useSearchViewModel';
import { SearchUserRepository } from '../src/domain/SearchUserRepository';
import { RateLimitError } from '../src/data/RateLimitError';

// Use fake timers for debounce
jest.useFakeTimers();

describe('SearchViewModel (debounced)', () => {
    let mockRepo: { searchUser: jest.Mock };

    beforeEach(() => {
        mockRepo = {
        searchUser: jest.fn().mockResolvedValue([
            { id: '1', nodeId: '1', login: 'JohnDoe', avatarUrl: '' },
        ]),
        };
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.clearAllMocks();
    });

    it('should debounce API calls and only call repo once', async () => {
        const { result } = renderHook(() =>
            useSearchViewModel({ repository: mockRepo, debounceDelay: 500 })
        );

        // Call fetchData multiple times quickly
        act(() => {
            result.current.fetchData('J');
            result.current.fetchData('Jo');
            result.current.fetchData('Joh');
            result.current.fetchData('John');
        });

        // Repo should not be called yet (debounce not elapsed)
        expect(mockRepo.searchUser).not.toHaveBeenCalled();

        // Advance time to trigger debounce
        await act(async () => {
            jest.advanceTimersByTime(500);
            // Wait for promises inside setTimeout
            await Promise.resolve();
        });

        expect(mockRepo.searchUser).toHaveBeenCalledTimes(1);
        expect(mockRepo.searchUser).toHaveBeenCalledWith('John', new AbortController().signal);
  });


  it('should not call API when empty query is debounced', async () => {
        const { result } = renderHook(() =>
            useSearchViewModel({ repository: mockRepo, debounceDelay: 500 })
        );

        // Call fetchData multiple times quickly, ending with empty string
        act(() => {
            result.current.fetchData('Joh');
            result.current.fetchData('');
        });

        // Repo should not be called yet (debounce not elapsed)
        expect(mockRepo.searchUser).not.toHaveBeenCalled();

        // Advance time to trigger debounce
        await act(async () => {
            jest.advanceTimersByTime(500);
            // Wait for promises inside setTimeout
            await Promise.resolve();
        });

        expect(result.current.usersData).toEqual([]);
        expect(mockRepo.searchUser).not.toHaveBeenCalled();
  });

  it('should reset users to empty array for empty query without API call', async () => {
        const { result } = renderHook(() =>
            useSearchViewModel({ repository: mockRepo, debounceDelay: 500 })
        );

        act(() => {
            result.current.fetchData('   '); // whitespace only
        });

        await act(async () => {
            jest.advanceTimersByTime(500);
            await Promise.resolve();
        });

        expect(result.current.usersData).toEqual([]);
        expect(mockRepo.searchUser).not.toHaveBeenCalled();
    });

  it('should update usersData after successful fetch', async () => {
        const { result } = renderHook(() =>
            useSearchViewModel({ repository: mockRepo, debounceDelay: 10 })
        );

        act(() => {
            result.current.fetchData('John');
        });

        // Fast-forward debounce delay
        await act(async () => {
            jest.advanceTimersByTime(10);
            await Promise.resolve();
        });

        expect(result.current.usersData).toEqual([
            { id: '1', nodeId: '1', login: 'JohnDoe', avatarUrl: ''  }
        ]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
  });

  it('should set error if repo.searchUser throws', async () => {
        mockRepo.searchUser.mockRejectedValueOnce(new Error('API failed'));
            const { result } = renderHook(() =>
            useSearchViewModel({ repository: mockRepo, debounceDelay: 10 })
        );

        act(() => {
            result.current.fetchData('John');
        });

        await act(async () => {
            jest.advanceTimersByTime(10);
            await Promise.resolve();
        });

        expect(result.current.error).toContain('Unable to fetch users. Please try again.');
        expect(result.current.loading).toBe(false);
  });

  it('should clear usersData when query is empty', async () => {
    const { result } = renderHook(() =>
      useSearchViewModel({ repository: mockRepo, debounceDelay: 10 })
    );

    act(() => {
      result.current.fetchData('');
    });

    await act(async () => {
        jest.advanceTimersByTime(10);
        await Promise.resolve();
    });

    expect(result.current.usersData).toEqual([]);
    expect(mockRepo.searchUser).not.toHaveBeenCalled();
  });
});




describe('useSearchViewModel - selection logic', () => {
    it('adds a user to selection when not already selected', () => {
        const { result } = renderHook(() => useSearchViewModel());

        act(() => {
            result.current.toggleSelection('1');
        });

        expect(result.current.selectedIds).toEqual(['1']);
    });

    it('removes a user when already selected', () => {
        const { result } = renderHook(() => useSearchViewModel());

        // Select first
        act(() => {
            result.current.toggleSelection('1');
        });
        expect(result.current.selectedIds).toEqual(['1']);

        // Deselect same user
        act(() => {
            result.current.toggleSelection('1');
        });
        expect(result.current.selectedIds).toEqual([]);
    });

    it('can select multiple users', () => {
        const { result } = renderHook(() => useSearchViewModel());

        act(() => {
            result.current.toggleSelection('1');
            result.current.toggleSelection('2');
            result.current.toggleSelection('3');
        });

        expect(result.current.selectedIds).toEqual(['1', '2', '3']);
    });

    it('removes only the correct user when deselecting one of many', () => {
        const { result } = renderHook(() => useSearchViewModel());

        act(() => {
            result.current.toggleSelection('1');
            result.current.toggleSelection('2');
            result.current.toggleSelection('3');
        });

        act(() => {
            result.current.toggleSelection('2'); // remove user 2
        });

        expect(result.current.selectedIds).toEqual(['1', '3']);
    });
});



describe('useSearchViewModel - removeSelected', () => {

    const initialUsers = [
        { id: '1', nodeId: '1', login: 'Alice', avatarUrl: '' },
        { id: '1',  nodeId: '2', login: 'Bob', avatarUrl: ''  },
        { id: '1',  nodeId: '3', login: 'Charlie', avatarUrl: '' },
    ];

    it('removes selected users from the list', () => {
        const { result } = renderHook(
            () => useSearchViewModel({ initialUsers })
        );

        // Select user 1 and 2
        act(() => {
        result.current.toggleSelection('1');
        result.current.toggleSelection('2');
        });

        expect(result.current.selectedIds).toEqual(['1', '2']);
        expect(result.current.usersData.map(user => user.nodeId)).toEqual(['1', '2', '3']);

        // Remove selected users
        act(() => {
            result.current.deleteSelected();
        });

        // ✅ Expected: users with nodeId 1 and 2 removed
        expect(result.current.usersData.map(user => user.nodeId)).toEqual(['3']);
        // ✅ selectedIds should be cleared
        expect(result.current.selectedIds).toEqual([]);
    });

    it('does nothing if no users are selected', () => {
        const { result } = renderHook(
            () => useSearchViewModel({ initialUsers })
        );

        act(() => {
            result.current.deleteSelected();
        });

        // ✅ List should remain unchanged
        expect(result.current.usersData.map(user => user.nodeId)).toEqual(['1', '2', '3']);
        expect(result.current.selectedIds).toEqual([]);
    });

    it('removes only the selected users', () => {
        const { result } = renderHook(
            () => useSearchViewModel({ initialUsers })
        );

        act(() => {
            result.current.toggleSelection('2');
        });

        expect(result.current.selectedIds).toEqual(['2']);

        act(() => {
        result.current.deleteSelected();
        });

        // ✅ Only user 2 removed
        expect(result.current.usersData.map(user => user.nodeId)).toEqual(['1', '3']);
    });
});




describe('useSearchViewModel - duplicateSelected', () => {
    const initialUsers = [
        { id: '1', nodeId: '1', login: 'Alice', avatarUrl: ''  },
        { id: '1', nodeId: '2', login: 'Bob', avatarUrl: ''  },
        { id: '1', nodeId: '3', login: 'Charlie', avatarUrl: ''  },
    ];

    beforeEach(() => {
        jest.spyOn(Date, 'now').mockReturnValue(1234567890); // deterministic ID
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('duplicates all selected users and prepends them', () => {
        const { result } = renderHook(() => useSearchViewModel({ initialUsers })
        );

        // Select 1 and 3
        act(() => {
            result.current.toggleSelection('1');
            result.current.toggleSelection('3');
        });

        act(() => {
            result.current.duplicateSelected('1234567890-6iua9rj');
        });

        const ids = result.current.usersData.map(u => u.nodeId);

        // ✅ Expect duplicates added first
        expect(ids).toEqual([
            '1-1234567890-6iua9rj',
            '3-1234567890-6iua9rj',
            '1',
            '2',
            '3',
        ]);

        // ✅ Verify duplicates have the same data but different IDs
        expect(result.current.usersData[0].login).toBe('Alice');
        expect(result.current.usersData[1].login).toBe('Charlie');
    });

    it('does nothing if no user is selected', () => {
        const { result } = renderHook(() => useSearchViewModel({ initialUsers })
        );

        act(() => {
            result.current.duplicateSelected();
        });

        expect(result.current.usersData.map(u => u.nodeId)).toEqual(['1', '2', '3']);
    });

    it('duplicates each selected user only once per call', () => {
        const { result } = renderHook(() => useSearchViewModel({ initialUsers })
        );

        act(() => {
            result.current.toggleSelection('2');
        });

        act(() => {
            result.current.duplicateSelected();
            result.current.duplicateSelected();
        });

        const filtered = result.current.usersData.filter(u => u.login === 'Bob');
        // ✅ Should have original + 2 duplicates
        expect(filtered.length).toBe(3);
    });
});



describe('SearchViewModel - selection state', () => {
    const initialUsers = [
        { id: '1', nodeId: '1', login: 'Alice', avatarUrl: '' },
        { id: '1', nodeId: '2', login: 'Bob', avatarUrl: '' },
        { id: '1', nodeId: '3', login: 'Charlie', avatarUrl: '' },
    ];

    it('should have both false when nothing is selected', () => {
        const { result } = renderHook(
            () => useSearchViewModel({ initialUsers })
        );

        expect(result.current.isAllItemSelected).toBe(false);
        expect(result.current.isSomeItemSelected).toBe(false);
    });

    it('should set isSomeItemSelected true when only some users are selected', () => {
        const { result } = renderHook(
            () => useSearchViewModel({ initialUsers })
        );

        act(() => {
            result.current.toggleSelection('1');
        });

        expect(result.current.selectedIds).toEqual(['1']);
        expect(result.current.isAllItemSelected).toBe(false);
        expect(result.current.isSomeItemSelected).toBe(true);
    });

    it('should set isAllItemSelected true when all users are selected', () => {
        const { result } = renderHook(
            () => useSearchViewModel({ initialUsers })
        );
        act(() => {
            // select all manually
            result.current.selectAll();
        });

        expect(result.current.selectedIds).toEqual(['1', '2', '3']);
        expect(result.current.isAllItemSelected).toBe(true);
        expect(result.current.isSomeItemSelected).toBe(false);
    });

    it('should update flags correctly when selection changes from all → some → none', () => {
        const { result } = renderHook(
            () => useSearchViewModel({ initialUsers })
        );

        // Select all
        act(() => {
            result.current.selectAll();
        });

        expect(result.current.isAllItemSelected).toBe(true);
        expect(result.current.isSomeItemSelected).toBe(false);

        // Deselect one (some selected)
        act(() => {
            result.current.toggleSelection('2');
        });

        expect(result.current.selectedIds).toEqual(['1', '3']);
        expect(result.current.isAllItemSelected).toBe(false);
        expect(result.current.isSomeItemSelected).toBe(true);

        // Deselect all
        act(() => {
            result.current.clearSelection();
        });

        expect(result.current.isAllItemSelected).toBe(false);
        expect(result.current.isSomeItemSelected).toBe(false);
    });
});

describe('useSearchViewModel - rate limit behavior', () => {

    let mockRepo: jest.Mocked<SearchUserRepository>;
    const mockUsers = [
            { id: '1', nodeId: '1', login: 'Alice', avatarUrl: '' },
            { id: '1', nodeId: '2', login: 'Bob', avatarUrl: '' },
            { id: '1', nodeId: '3', login: 'Charlie', avatarUrl: '' },
        ];

    beforeEach(() => {
        mockRepo = {
        searchUser: jest.fn(),
        } as unknown as jest.Mocked<SearchUserRepository>;
    });

    it('should fetch users successfully when no rate limit', async () => {
        mockRepo.searchUser.mockResolvedValue(mockUsers);

        const { result } = renderHook(() => useSearchViewModel({ repository: mockRepo, debounceDelay: 0 }));

        await act(async () => {
            result.current.fetchData('alice');
            jest.runAllTimers(); // run debounce
            await Promise.resolve(); // flush promises
        });

        expect(result.current.usersData).toEqual(mockUsers);
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBe(false);
    });

    it('should handle rate limit error and set resetDate + message', async () => {
        const resetDate = new Date(Date.now() + 60000);
        mockRepo.searchUser.mockRejectedValue(new RateLimitError('Rate limit exceeded', resetDate, 0));

        const { result } = renderHook(() => useSearchViewModel({ repository: mockRepo, debounceDelay: 0 }));

        await act(async () => {
            result.current.fetchData('bob');
            jest.runAllTimers();
            await Promise.resolve();
        });

        expect(result.current.error).toContain('Rate limit exceeded');
        expect(result.current.loading).toBe(false);
        expect(result.current.usersData).toEqual([]);
    });



    it('should allow fetch again when resetDate expired', async () => {
        const pastDate = new Date(Date.now() - 60000);
        mockRepo.searchUser.mockRejectedValue(
            new RateLimitError('Rate limit exceeded', pastDate, 0)
        );
        mockRepo.searchUser.mockResolvedValue(mockUsers);

        const { result } = renderHook(() => useSearchViewModel({
        repository: mockRepo,
        debounceDelay: 0,
        initialUsers: []
        }));

        await act(async () => {
            result.current.fetchData('bob', pastDate);
            jest.runAllTimers();
            await Promise.resolve();
        });

        expect(mockRepo.searchUser).toHaveBeenCalled();
        expect(result.current.error).toBeNull();
        expect(result.current.usersData).toEqual(mockUsers);
    });
});
