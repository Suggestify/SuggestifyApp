import React, { useState, useEffect, useRef } from 'react';

import { SafeAreaView, StyleSheet, View, FlatList, RefreshControl, TouchableOpacity, Text } from 'react-native';
import {Ionicons} from "@expo/vector-icons";

import api from "../../helperFunctions/Api";

import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';

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
                const response = await api.get(`/ai/loadMessages`, {
                    params: {
                        userName: route.params.userName,
                        chatType: type,
                        earliestMessageId: currHistory[0].msgID,
                    }
                });
                return response.data;
            } catch (error) {
                console.error('Failed to load messages:', error);
                return [];
            }
    }

    const ChatHeader = ({ onBackPress, title }) => (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={onBackPress}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
        </View>
    );


        return (
            <SafeAreaView style={styles.container}>
                <ChatHeader
                    onBackPress={() =>   navigation.navigate("Home")}
                    title= {type}
                />
                <FlatList
                    ref={flatListRef}
                    data={currHistory}
                    renderItem={({ item }) => <ChatBubble message={item.message} type={item.type} medium = {type} initial ={route.params.userName}/>}
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
    };

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
            backgroundColor: '#525252',
        },
        footer: {
            height: 10,
        },
        headerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            backgroundColor: '#333',
            height: 50
        },
        headerTitle: {
            color: 'white',
            fontSize: 18,
            marginLeft: 10,
        }
    });

