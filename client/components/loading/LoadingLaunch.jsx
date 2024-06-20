import React, { useEffect, useContext } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "react-native";
import { ContactContext } from "../../ContactContext";

import api from "../../helperFunctions/Api";
import asyncStorage from "@react-native-async-storage/async-storage";


function Loading({ navigation }) {
    const { contact, updateContact } = useContext(ContactContext);

    useEffect(() => {
        const checkToken = async () => {
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (accessToken) {
                const userName = await AsyncStorage.getItem('userName');
                updateContact({userName: userName});
                const response = await api.get(`/settings/fetchSettings`, {
                    params: {
                        userName: userName
                    }
                })
                if (response.status === 200) {
                    updateContact({theme: response.data.theme});
                    updateContact({notificationOn: response.data.notificationOn});
                    updateContact({mediumOrder: response.data.mediumOrder});
                    navigation.navigate('Home')
                }
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
