import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, TextInput, Button} from "react-native";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import axios from "axios";
import Global from "../Global";

function ChatInput(props) {
    const [userName, setUserName] = useState(null);
    const [message, setMessage] = useState('');
    const type = props.chatType;

    async function handleSend() {
        const response = await axios.post(`${Global.ip}/ai/sendMessage`, {
            userName: userName,
            messageContent: message,
            type: type
        });
        if(response.status === 200){  // could split into 2 functions
            console.log(response);
            await props.onUpdate(message, "AI");
            await props.onUpdate(response.data, "User");
            console.log("success");
        }
    }
    useEffect(() => {
        async function getUserName() {
            const res = await asyncStorage.getItem("userName");
            setUserName(res);
        }
        getUserName();
    }, []);


    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Type your message here..."
                onSubmitEditing={handleSend}
            />
            <View style={styles.button}>
                <Button title="->" onPress={handleSend} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#6a656a',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        marginRight: '2%',
        paddingHorizontal: 10,
        paddingVertical: 5, // Adjust based on your design
    },
    button: {
        backgroundColor: 'darkorange',
        borderRadius: '25%',
        width: '13%',

    },
});

export default ChatInput;