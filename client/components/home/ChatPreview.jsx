import React, {useState, useContext} from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, StyleSheet } from 'react-native';

import { LinearGradient } from "expo-linear-gradient";

import {ContactContext} from "../../helperFunctions/ContactContext";
import api from "../../helperFunctions/Api";

function ChatPreview({ medium, color, image }) {
    const { contact, updateContact } = useContext(ContactContext);
    const userName = contact.userName
    const [lastMessage, setLastMessage] = useState('Loading last message...');


    useFocusEffect(
        React.useCallback(() => {
            const fetchLastMessage = async () => {
                try {
                    const response = await api.get(`/ai/fetchMessages`, {
                        params: {
                            userName: userName,
                            chatType: medium,
                            fetchAmt: 1
                        }
                    });
                    let message = response.data?.[0]?.message ?? "Start a conversation!";
                    message = message.slice(0, 30); // Limit the message to 30 characters
                    setLastMessage(message);
                } catch (error) {
                    console.error('Failed to fetch last message:', error);
                    setLastMessage('Failed to load message.'); // Error text
                }
            };
            fetchLastMessage();
        }, [userName, medium])
    );



    return (
        <LinearGradient style={[styles.container, {borderColor: color}]} colors={[color, '#131313']} start={{ x: 0.2, y: 1 }} end={{ x: 1.1, y: 1 }}>
            <Image source={image} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.mediumText}>
                    {medium}
                </Text>
                <Text style={styles.lastMessageText}>
                    {lastMessage}
                </Text>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', // Layout children in a row
        padding: 10,
        borderRadius: 10,
        alignItems: 'center', // Center items vertically in the container
        justifyContent: 'flex-start', // Align items to the start of the container
        width: '85%', // Ensure the container takes up the full width
        height: 70,
        borderWidth: 2,
        borderStyle: "solid",
    },
    image: {
        width: 40,
        height: 40,
        marginHorizontal: 10, // Add some margin right for spacing between image and text
    },
    textContainer: {
        flex: 1, // Take up all remaining space
    },
    mediumText: {
        fontSize: 22,
        fontWeight: 'bold', // Optional: to highlight the medium text
        color: '#ffffff',
    },
    lastMessageText: {
        color: '#d7d7d7',
    },
});

export default ChatPreview;
