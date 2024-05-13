import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View, FlatList} from "react-native";
import {Button, Header, Icon} from "react-native-elements";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";

function ChatScreen({route, navigation}) {
// take in navigation props to use as array
    const [currHistory, setCurrHistory] = useState([]);
    const type = route.params.medium;

    useEffect(() => {
        const initialHistory = route.params.chatHistory.map((message, index) => ({
            id: index,
            message: message,
            type: index % 2 === 0 ? "AI" : "User",
        }));
        setCurrHistory(initialHistory);

    }, [route.params.history]);
    // change test
    function updateHistory(newMessage, type) {
        console.log("updating history" +  type + " " + newMessage );
        console.log(newMessage);
        setCurrHistory(currentHistory => [
            ...currentHistory,
            { id: currentHistory.length, message: newMessage, type: type },
        ]);
    }


    return ( // pass in props for menu
        <SafeAreaView style = {styles.back}>
            <FlatList data={currHistory} renderItem={({item}) =>  (<ChatBubble message = {item.message} type = {item.type}/>)}
                      keyExtractor={(item) => item.id.toString()}
            />
            <View style = {styles.input}>
                <ChatInput chatType = {type} onUpdate = {updateHistory}> </ChatInput>
            </View>

        </SafeAreaView>
    );
}

export default ChatScreen;

const styles = StyleSheet.create({
    back: {
        flex: 1,
        backgroundColor: "#525252",
        height: "100%"
    },
    input:{
        justifyContent: "flex-end",
        width: "100%"
    }

});