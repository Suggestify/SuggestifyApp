import React, {useState, useEffect, useContext} from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import {ContactContext} from "../../ContactContext";
import axios from "axios";
import Global from "../Global";

function ChatPreview({ medium, color, image }) {
    const { contact, updateContact } = useContext(ContactContext);
    const userName = contact.userName
    const [lastMessage, setLastMessage] = useState('Loading last message...');

    useEffect(() => {
        const fetchLastMessage = async () => {
            try {
                console.log("userName" + userName + " chatType " + medium);
                const response = await axios.get(`${Global.ip}/ai/fetchMessages`, {
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
    }, [userName, medium]); // Re-run the effect if userName or medium changes


    return (
        <LinearGradient style={styles.container} colors={[color, '#000000']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
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
        width: '100%', // Ensure the container takes up the full width
        height: 95
    },
    image: {
        width: 50,
        height: 50,
        marginHorizontal: 10, // Add some margin right for spacing between image and text
    },
    textContainer: {
        flex: 1, // Take up all remaining space
    },
    mediumText: {
        fontSize: 22,
        fontWeight: 'bold', // Optional: to highlight the medium text
        color: '#ccc',
    },
    lastMessageText: {
        color: '#8f8f8f', // Optional: different color for less emphasis
    },
});

export default ChatPreview;
