import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import asyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Global from '../Global';

function ChatInput(props) {
    const [userName, setUserName] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);  // Added loading state
    const type = props.chatType;

    useEffect(() => {
        async function getUserName() {
            const res = await asyncStorage.getItem('userName');
            setUserName(res);
        }
        getUserName();
    }, []);

    async function handleSend() {
        if (loading) return;  // Prevent multiple sends if already loading
        setLoading(true);  // Set loading to true when send starts
        try {
            const response = await axios.post(`${Global.ip}/ai/sendMessage`, {
                userName: userName,
                messageContent: message,
                type: type,
            });

            if (response.status === 200) {
                await props.onUpdate(message, 'AI');
                await props.onUpdate(response.data, 'User');
                setMessage('');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
        setLoading(false);  // Reset loading state whether success or fail
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type your message here..."
                    onSubmitEditing={handleSend}
                />
                <TouchableOpacity style={styles.button} onPress={handleSend} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#00ff00" />
                    ) : (
                        <Text style={styles.buttonText}>→</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        width: '100%',
        paddingBottom: 10,
        backgroundColor: '#525252',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        width: '95%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 25,
        backgroundColor: 'white',
        height: 40,
    },
    input: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 10,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
        height: 30,
        width: 35,
        borderRadius: 25,
        backgroundColor: 'black',
    },
    buttonText: {
        fontSize: 25,
        color: 'blue',
    },
});

export default ChatInput;
