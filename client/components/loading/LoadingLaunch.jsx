import React, { useEffect, useContext } from 'react';

import AsyncStorage from "@react-native-async-storage/async-storage";
import {Text, View } from "react-native";
import {Heading, HStack, Spinner} from "native-base";

import { ContactContext } from "../../helperFunctions/ContactContext";
import api from "../../helperFunctions/Api";
import asyncStorage from "@react-native-async-storage/async-storage";
import Global from "../../helperFunctions/Global";
import axios from "axios";

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
                else{
                    console.log("error")
                }
            } else {
                const verified = await AsyncStorage.getItem('verification');
                if(verified){
                    const tempUserName = await AsyncStorage.getItem('tempUserName');
                    navigation.navigate('Verify', {userName: tempUserName});
                }
                else{
                    navigation.navigate('SignIn');
                }
            }
        };

        checkToken();
    }, [navigation]);
    const SpinnerComp = () => {
        return <HStack space={2} justifyContent="center">
            <Spinner accessibilityLabel="Loading posts" />
            <Heading color="primary.500" fontSize="xl">
            </Heading>
        </HStack>;
    };
    return (
        <View style={styles.container}>
            <SpinnerComp />
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
