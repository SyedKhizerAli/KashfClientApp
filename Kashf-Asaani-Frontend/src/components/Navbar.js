import React, {useContext} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ navigation }) => {
    const {logout} = useContext(AuthContext)

    const onLogoutPress = () => {
        logout();
        navigation.navigate('Main')
    }
    return (
        <View style={styles.navbar}>
            <TouchableOpacity onPress={onLogoutPress}>
                {/* <Text style={styles.logoutText}>لاگ آوٹ</Text> */}
                <Icon name="power-off" size={24} color="#f1f1d6" style={styles.logout}/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'flex-end', 
        alignItems: 'center',
        backgroundColor: 'rgba(203, 132, 124, 0.8)', // 9e1911 color with 80% opacity
        // padding: 10,
        // marginTop: 30,
    },
    logoutText: {
        color: '#f1f1d6',
        fontSize: 20,
        textAlign: 'right',
        fontWeight: 'bold',
        margin: 5,
        paddingRight: 8
    },
    logout: {
        color: '#f1f1d6',
        margin: 15,
        paddingRight: 8
    },
});

export default Navbar;
