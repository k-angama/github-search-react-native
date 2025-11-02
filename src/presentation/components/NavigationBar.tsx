import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type TopBarProps = {
    title: string;
    editMode?: boolean;
    disabled?: boolean;
    onEditPress?: (enabled: boolean) => void;
};

export function TopBar(props: TopBarProps) {
    
    const { title, editMode, disabled, onEditPress } = props;

    const handleToggle = () => {
        onEditPress && onEditPress(!editMode)
    }

    return (
        <View style={ styles.navbar }>
            <Text style={ styles.title }>{ title }</Text>
            <TouchableOpacity 
                style={ [styles.editButton, disabled && styles.disabled ] } 
                onPress={ handleToggle }  
                disabled={ disabled }
            > 
                <Text style={ styles.editButtonText }>{ editMode ? 'Done' : 'Edit' }</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e2e2',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    editButton: {
        position: "absolute",
        right: 16,  
        top: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: "#007AFF",
        borderRadius: 8,
    },
    editButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
    disabled: {
        opacity: 0.5,
    },
});