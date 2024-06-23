import React, {useState, useEffect, useRef, useContext} from 'react';

import {SafeAreaView, StyleSheet, View, FlatList, RefreshControl, TouchableOpacity, ImageBackground} from 'react-native';
import {Text} from 'native-base'
import {Ionicons} from "@expo/vector-icons";

import api from "../../helperFunctions/Api";

import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import {ContactContext} from "../../helperFunctions/ContactContext";
const wallPaperD = require('../../assets/backgrounds/ChatD.png');
const wallPaperL = require('../../assets/backgrounds/ChatL.png');

function ChatScreen({ route, navigation }) {
    const [currHistory, setCurrHistory] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isAddingNewMessage, setIsAddingNewMessage] = useState(true);
    const {contact, updateContact} = useContext(ContactContext);
    const theme = contact.theme;
    const type = route.params.medium;
    const flatListRef = useRef(null);
    const wallpaper = theme ? wallPaperD : wallPaperL;

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
            // error state
            return [];
        }
    }

    const ChatHeader = ({ onBackPress, title }) => (
        <View style={styles.headerContainer}>

            <TouchableOpacity onPress={onBackPress}>
                <Ionicons name="arrow-back" size={24} color={theme ? '#b2b2b2' : 'darkText'} />
            </TouchableOpacity>
            <Text color={theme ? 'trueGray.300' : 'darkText'} style={styles.headerTitle}>{title}</Text>
        </View>
    );


        return (
            <SafeAreaView style={[styles.container, {backgroundColor: theme ? '#1a1919' : '#f6f6f6'}]} >
            <ImageBackground source={wallpaper} resizeMode="cover" style={styles.container}>
                <ChatHeader
                    style={[ {backgroundColor: theme ? 'black' : 'black'}]}
                    onBackPress={() =>   navigation.navigate("Home")}
                    title= {type}
                />

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
                <View style={[styles.inputContainer, {backgroundColor: theme ? '#1a1919' : '#f6f6f6'}]}>
                    <ChatInput chatType={type} onUpdate={updateHistory} />
                </View>
            </ImageBackground>
            </SafeAreaView>

        );
    };

    export default ChatScreen;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        flatListContent: {
            flexGrow: 1,
            justifyContent: 'flex-end',
        },
        inputContainer: {
            paddingTop: 30,
            justifyContent: 'flex-end',
            width: '100%',

        },
        footer: {
            height: 10,
        },
        headerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,

            height: 50
        },
        headerTitle: {
            fontSize: 18,
            marginLeft: 10,
        }
    });

