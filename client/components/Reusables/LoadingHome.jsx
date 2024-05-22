import React, { useEffect,useState } from 'react';
import { Text, View } from "react-native";
//import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import axios from 'axios'
import Global from "../Global";


function Loading({route, navigation }) {
    const { userName, medium } = route.params;

    async function pullChat(){
        try {
            const response = await axios.get(`${Global.ip}/ai/fetchMessages`, {
                params: {
                    userName: userName,
                    chatType: medium
                }
            })

            if (response.status === 200) {
                console.log(response.data);
                navigation.navigate("ChatScreen", {
                    userName: userName,
                    medium: medium,
                    chatHistory: response.data
                })
            } else {
                console.log("error" + response.status)
            };
        }catch (err){
            console.log(err)
        }
    }

    useEffect(() => {
        pullChat();
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
