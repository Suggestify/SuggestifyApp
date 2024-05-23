import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import axios from "axios";
import Global from "../Global";


function ChatScreen({ route, navigation }) {
    const [currHistory, setCurrHistory] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isAddingNewMessage, setIsAddingNewMessage] = useState(true);
    const type = route.params.medium;
    const flatListRef = useRef(null);

    function formatMessages(messages) {
        const uniqueSuffix = Date.now();
        return messages.map((message, index) => ({
            id: `${message.msgID}-${uniqueSuffix}-${index}`,
            message: message.message,
            type: index % 2 === 0 ? 'AI' : 'User',
            msgID: message.msgID
        }));
    }

    useEffect(() => {
        const initialHistory = formatMessages(route.params.chatHistory)
        setCurrHistory(initialHistory);
    }, [route.params.chatHistory]);

    useEffect(() => {
        if (isAddingNewMessage && currHistory.length > 0) {
            const scrollTimeout = setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 200);

            return () => clearTimeout(scrollTimeout);
        }
    }, [isAddingNewMessage, currHistory.length]);


    function updateHistory(newMessage, type) {
        setIsAddingNewMessage(true);
        setCurrHistory((currentHistory) => [
            ...currentHistory,
            { id: currentHistory.length, message: newMessage, type: type },
        ]);
    }

    async function onRefresh() {
        setRefreshing(true);
        setIsAddingNewMessage(false);
        try {
            let moreMessages = await loadMessages();
            moreMessages = formatMessages(moreMessages);
            setCurrHistory(prevState => [...moreMessages, ...prevState]);
        } catch (error) {
            console.error('Failed to refresh messages:', error);
        }
        setRefreshing(false);
    }

    async function loadMessages() {
        try {
            const response = await axios.get(`${Global.ip}/ai/loadMessages`, {
                params: {
                    userName: route.params.userName,
                    chatType: type,
                    earliestMessageId: currHistory[0]?.msgID,
                }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to load messages:', error);
            // error state
            return [];
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={currHistory}
                renderItem={({ item }) => <ChatBubble message={item.message} type={item.type} />}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.flatListContent}
                ListFooterComponent={<View style={styles.footer} />}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
            <View style={styles.inputContainer}>
                <ChatInput chatType={type} onUpdate={updateHistory} />
            </View>
        </SafeAreaView>
    );
}

export default ChatScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#525252',
    },
    flatListContent: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    inputContainer: {
        justifyContent: 'flex-end',
        width: '100%',
        backgroundColor: '#525252', // Ensure the input container is visible
    },
    footer: {
        height: 10,
    }
});
