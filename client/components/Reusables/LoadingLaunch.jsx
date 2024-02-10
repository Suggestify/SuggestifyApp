import React, { useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "react-native";

function Loading({ navigation }) {

    useEffect(() => {
        const checkToken = async () => {
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (accessToken) {
                navigation.navigate('Home');
            } else {
                navigation.navigate('SignIn');
            }
        };

        checkToken();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Loading...</Text>
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    text: {
        fontSize: 24,
        color: '#333',
    }
};

export default Loading;
