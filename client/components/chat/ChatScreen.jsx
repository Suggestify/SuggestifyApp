import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from "react-native";
import {Button, Header, Icon} from "react-native-elements";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";

function ChatScreen({route, navigation}) {
// take in navigation props to use as array
    const currHistory = route.params.chatHistory;
    const type = route.params.medium;

    let chatHistory = [];
    for(let i =0; i < currHistory.length; i++) {
        if (i % 2 === 0) {
            chatHistory.push({id: i, message: currHistory[i], type: "AI"});
        } else {
            chatHistory.push({id: i, message: currHistory[i], type: "User"});
        }
    }
    // change test



    return ( // pass in props for menu
        <SafeAreaView style = {styles.back}>

            <View>
                {chatHistory.map((item) => (
                    <View key= {item.id}>
                        <ChatBubble message = {item.message} type = {item.type}></ChatBubble>
                    </View>
                ))}
            </View>

            <View style = {styles.input}>
                <ChatInput chatType = {type}> </ChatInput>
            </View>


        </SafeAreaView>
    );
}

export default ChatScreen;

const styles = StyleSheet.create({
    back: {
        backgroundColor: "#525252",
        height: "100%"
    },
    input:{
        flex: 1,
        justifyContent: "flex-end",
        width: "100%"
    }

});