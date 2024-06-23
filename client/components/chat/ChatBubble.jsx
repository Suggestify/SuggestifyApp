import React from 'react';

import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-elements";

import ChatIcon from "./ChatIcon";

function ChatBubble(props) {
    if (props.type === "AI") {
        return (
            <View style={[styles.container, styles.AIText]}>
                <Card containerStyle={styles.card}>
                    <Text style={styles.text}>{props.message}</Text>
                </Card>
                <ChatIcon initial = {props.initial}/>
            </View>
        );
    } else if (props.type === "User") {
        return (
            <View style={[styles.container, styles.UserText]}>
                <ChatIcon medium = {props.medium}/>
                <Card containerStyle={styles.card}>
                    <Text style={styles.text}>{props.message}</Text>
                </Card>
            </View>
        );
    }
}

export default ChatBubble;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginVertical: 5,
    },
    AIText: {
        alignSelf: "flex-end",
        marginRight: 10,
    },
    UserText: {
        alignSelf: "flex-start",
        marginLeft: 10,
    },
    card: {
        borderRadius: 20,
        margin: 7,
        maxWidth: "80%",
    },

});
