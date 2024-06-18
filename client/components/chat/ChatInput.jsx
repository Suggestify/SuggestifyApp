import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import asyncStorage from '@react-native-async-storage/async-storage';
import api from '../../helperFunctions/Api';
import { useToast, Box} from 'native-base';

function ChatInput(props) {
    const [userName, setUserName] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);  // Added loading state
    const type = props.chatType;
    const toast = useToast();

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
            const response = await api.post(`/ai/sendMessage`, {
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
            if(error.response.data == "Rate limit exceeded"){
                toast.show({
                    duration: 5000,
                    render: () => {
                        return <Box style={styles.pb} bg="red.50" px="5" py="3" rounded="md" mb={5}>
                           Daily Limit Reached, Upgrade to Premium for Extended Access
                        </Box>;
                    }
                });
            }
            else {
                toast.show({
                    duration: 1200,
                    render: () => {
                        return <Box style={styles.pb} bg="red.50" px="5" py="3" rounded="md" mb={5}>
                            Error, PLease Try Again Later
                        </Box>;
                    }
                });
            }
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
    pb: {
        marginBottom: 50,
    },
});

export default ChatInput;
