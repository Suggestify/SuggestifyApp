import React, { useEffect,useState } from 'react';
import { Text, View } from "react-native";
import axios from 'axios'

function Loading({userName, medium, navigation }) {
    const [chatHistory, setChatHistory] = useState("");

    useEffect(() => {
        async function pullChat(){
            try {
                const response = await axios.get("pull the chat info", {
                    userName: userName,
                    medium: medium
                })
                setChatHistory(response.data)
                if (response.status === 200) {
                    navigation.navigate("ChatScreen", {
                        userName: userName,
                        medium: medium,
                        chatHistory: chatHistory
                    })
                } else {
                    console.log("error" + response.status)
                }
                ;
            }catch (err){
                console.log(err)
            }
        };

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
