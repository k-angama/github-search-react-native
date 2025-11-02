import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Checkbox } from "./Checkbox";

export enum CheckboxState {
  Unchecked,
  Checked,
  Indeterminate,
}

type ActionBarProps = {
    selectedCount: number;
    isChecked: boolean;
    isIndeterminate?: boolean;
    editMode?: boolean;
    onSelectAll: () => void;
    onCopy?: () => void;
    onDelete?: () => void;
};

export function ActionBar( props: ActionBarProps ) {
    
    const { 
        selectedCount, 
        isChecked, 
        isIndeterminate, 
        editMode, 
        onCopy, 
        onDelete, 
        onSelectAll 
    } = props;

    return (
        <View style={styles.container}>

            {/* Checkbox */}
            { editMode && <Checkbox 
                isChecked={ isChecked }
                isIndeterminate={ isIndeterminate }
                onToggle={ onSelectAll }            
            /> }

            {/* Text */}
            <Text style={styles.text}>
                {selectedCount} element{selectedCount > 1 ? 's' : ''} selected
            </Text>

            {/* Actions */}
            { editMode && <View style={styles.actions}>
                <TouchableOpacity onPress={onCopy} style={styles.iconButton} >
                    <Text style={styles.icon}>📋</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
                    <Text style={styles.icon}>🗑️</Text>
                </TouchableOpacity>
            </View> }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 38,
    },
    text: {
        flex: 1,
        fontSize: 14,
        color: '#000',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 6,
    },
    icon: {
        fontSize: 18,
    },
});