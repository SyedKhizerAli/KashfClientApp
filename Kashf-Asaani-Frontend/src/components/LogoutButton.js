import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const LogoutButton = ({ navigation }) => {
    const onLogoutPress = () => {
        navigation.navigate('Main')
    }
    return (
        <TouchableOpacity onPress={onLogoutPress}>
            <Text style={styles.logoutText}>لاگ آوٹ</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    logoutText: {
        color: '#f1f1d6',
        fontSize: 20,
        textAlign: 'right',
        fontWeight: 'bold',
        margin: 5,
        paddingRight: 8
    },
});

export default LogoutButton;
