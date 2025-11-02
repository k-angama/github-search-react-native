import { StyleSheet, ActivityIndicator, Text, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TopBar } from './components/NavigationBar';
import { SearchBar } from './components/SearchBar';
import {  useState } from 'react';
import { ActionBar } from './components/ActionBar';
import { ProfileItem } from './components/ProfileItem';
import { useSearchViewModel } from './useSearchViewModel';

export function SearchScreen() {

    const { 
        usersData, 
        fetchData, 
        loading, 
        error, 
        selectedIds, 
        toggleSelection, 
        deleteSelected,
        duplicateSelected,
        selectAll,
        clearSelection,
        isAllItemSelected,
        isSomeItemSelected,
    } =  useSearchViewModel(); 
 
    const [editMode, setEditMode] = useState(false); 

    const onSelectAll = () => {
        if (isAllItemSelected) {
            clearSelection();
        } else {
            selectAll();
        }
    };

    const setQueryAndFetch = (text: string) => {
        fetchData(text);
    }

    const removeAllSelection = () => {
        clearSelection();
        setEditMode(false);
    }

    const handleEditPress = (enabled: boolean) => {
        setEditMode(enabled);
        clearSelection();
    }

    return (
        <SafeAreaView style={ styles.containerSafeArea } >
            <View style={styles.container}>
                <TopBar 
                    title="Github Search" 
                    onEditPress={ handleEditPress } 
                    disabled={ usersData.length === 0 }
                    editMode={ editMode}
                />
                <View style={ styles.containerHeader }>
                    <SearchBar 
                        onSearch={ setQueryAndFetch } 
                        onClear={ removeAllSelection }
                        placeholder='Search input...' 
                    />
                    <ActionBar  
                        selectedCount={selectedIds.length} 
                        isChecked={ isAllItemSelected } 
                        isIndeterminate={ isSomeItemSelected }
                        editMode={ editMode }
                        onSelectAll={ onSelectAll }
                        onCopy={ duplicateSelected }
                        onDelete={ deleteSelected }
                    />
                </View>
                {/* 🔄 Loading indicator */}
                {loading && (
                    <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    </View>
                )}

                {/* 📭 No data message */}
                {!loading && !error && usersData.length === 0 && (
                    <View style={styles.centerContainer}>
                        <Text>No results</Text> 
                    </View>
                )}

                {/* ❗ Error message */}
                { error && (
                    <View style={styles.centerContainer}>
                        <Text style={ styles.textError }>{ error }</Text>
                    </View>
                )}

                {/* 📃 Data List */}
                {!loading && usersData.length > 0 && (
                    <FlatList 
                        style={ styles.containerScroll }
                        data={usersData}
                        keyExtractor={ item => item.nodeId }
                        renderItem={ 
                            (data) => <ProfileItem 
                                id={ data.item.id } 
                                login={ data.item.login } 
                                logoUri={ data.item.avatarUrl }
                                selected={ selectedIds.includes(data.item.nodeId) } 
                                onToggleSelect={ () => { toggleSelection(data.item.nodeId) }} 
                                onViewProfile={ () => {}} 
                                editMode={ editMode }
                            /> 
                        }
                        keyboardDismissMode='on-drag'
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerSafeArea: { 
        flex:1, 
        backgroundColor: '#f8f8f8'
    },
    containerScroll: {
        paddingHorizontal: 16,
    },
    containerHeader: {
        paddingHorizontal: 16,
    },
    textError: {
        color: 'red',
    },
    centerContainer: {
        flex: 1,
        paddingHorizontal: 16,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
});