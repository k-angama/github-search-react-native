import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useState } from 'react';


type SearchBarProps = {
    placeholder?: string;
    onSearch: (query: string) => void;
    onClear?: () => void;
}

export function SearchBar( props: SearchBarProps ) {

    const { placeholder, onSearch, onClear} = props;

    const [query, setQuery] = useState<string>('');

    const handleChange = (text: string) => {
        onSearch(text);
        setQuery(text);
    };

    const handleClear = () => {
        setQuery('');
        onSearch('');
        onClear && onClear();
    };

    return (
        <View style={styles.container}>
            <TextInput 
                style={styles.input}
                placeholder={ placeholder }
                onChangeText={ handleChange }
                value={query}
            />
            {query.length > 0 && (
                <TouchableOpacity style={styles.clearButton} onPress={ handleClear }>
                <Text style={styles.clearText}>✕</Text>
                </TouchableOpacity>
        )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#d4d4d4',
        borderBottomColor: '#d4d4d4',
        borderRadius: 8,
        marginVertical: 24,
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    clearButton: {
        padding: 5,
    },
    clearText: {
        fontSize: 18,
        color: '#888',
    },
});

