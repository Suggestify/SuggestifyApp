import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from "react-native";
import {Button, Header, Icon} from "react-native-elements";
import ChatIcon from "./ChatIcon";
import ChatBubble from "./ChatBubble";

function ChatScreen({route, navigation}) {
// take in navigation props to use as array
    console.log(route.params);
    const currHistory = route.params.chatHistory;

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
        <SafeAreaView>
        <View style={styles.inputView}>
            <Header leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
                    rightComponent={{ icon: 'home', color: '#fff' }}/>
        </View>

            <View>
                {chatHistory.map((item) => (
                    <View key= {item.id}>
                        <ChatBubble message = {item.message} type = {item.type}></ChatBubble>
                    </View>
                ))}
            </View>

        </SafeAreaView>
    );
}

export default ChatScreen;

const styles = StyleSheet.create({
    inputView: {
        width: "100%",
        justifyContent: "top",
    }
});