import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Checkbox } from "./Checkbox";


type SelectableItemProps = {
  id: string;
  login: string;
  logoUri?: string;
  selected: boolean;
  editMode?: boolean;
  onToggleSelect: () => void;
  onViewProfile: (id: string) => void;
};

export function ProfileItem( props: SelectableItemProps ) {

    const { id, login, logoUri, selected, editMode, onToggleSelect, onViewProfile } = props;

    return (
        <View
            style={[styles.container, selected && styles.selectedContainer]}
        >

        {/* Logo */}
        <View style={styles.logoContainer}>
            {logoUri ? (
            <Image source={{ uri: logoUri }} style={styles.logo} />
            ) : (
            <View style={styles.placeholderLogo}>
                <Text style={styles.placeholderText}>{login[0]?.toUpperCase()}</Text>
            </View>
            )}
        </View>

        {/* Info */}
        <View style={styles.info}>
            <Text style={styles.idText}>ID: {id}</Text>
            <Text style={styles.loginText}>{login}</Text>

            {/* View Profile Button */}
            <TouchableOpacity
            style={styles.profileButton}
            onPress={() => onViewProfile(id)}
            >
            <Text style={styles.profileButtonText}>View Profile</Text>
            </TouchableOpacity>
        </View>

        {/* Checkbox */}
        { editMode && <Checkbox 
            isChecked={selected} 
            onToggle={ onToggleSelect } 
        /> }
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 12,
      marginVertical: 6,
      borderWidth: 1,
      borderColor: '#eee',
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 2,
      elevation: 2,
  },
  selectedContainer: {
      backgroundColor: '#f0f7ff',
      borderColor: '#007AFF',
  },
  logoContainer: {
      marginRight: 12,
  },
  logo: {
      width: 40,
      height: 40,
      borderRadius: 20,
  },
  placeholderLogo: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
  },
  placeholderText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
  },
  info: {
      flex: 1,
  },
  idText: {
      fontSize: 12,
      color: '#666',
  },
  loginText: {
      fontSize: 16,
      color: '#000',
      fontWeight: '600',
      marginBottom: 4,
  },
  profileButton: {
      alignSelf: 'flex-start',
      backgroundColor: '#007AFF',
      borderRadius: 6,
      paddingVertical: 4,
      paddingHorizontal: 10,
      marginTop: 8,
  },
  profileButtonText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '500',
  },
  checkboxContainer: {
      marginLeft: 10,
  },
  checkbox: {
      width: 22,
      height: 22,
      borderWidth: 2,
      borderColor: '#007AFF',
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
  },
  checkboxSelected: {
      backgroundColor: '#007AFF',
  },
  checkmark: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
  },
});
