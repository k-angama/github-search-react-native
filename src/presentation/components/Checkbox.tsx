import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type CheckboxProps = {
    isChecked: boolean
    isIndeterminate?: boolean
    onToggle: () => void
};


export function Checkbox( props: CheckboxProps ) {
    
    const { isChecked, isIndeterminate, onToggle } = props;

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={ onToggle }
            activeOpacity={0.6}
        > 
            <View style={[styles.checkbox, (isChecked || isIndeterminate) && styles.checkboxSelected]}>
                { isChecked && <Text style={ styles.checkmark }>✓</Text> }
                { isIndeterminate && <View style={styles.semiMark} /> }
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
         marginRight: 8,
         zIndex: 1,
    },
    checkmark: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: -2,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#007AFF',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#007AFF',
    },
    semiMark: {
        width: 10,
        height: 2,
        backgroundColor: 'white',
        borderRadius: 1,
    },
});