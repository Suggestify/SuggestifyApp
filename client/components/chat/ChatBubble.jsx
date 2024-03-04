import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Card} from "react-native-elements";
import ChatIcon from "./ChatIcon";

function ChatBubble(props) {

    if (props.type === "AI") {
        return (//conditional render icon left or right, style property through props

            <View style={[styles.AIText]}>
                <Card containerStyle={{borderRadius: 15}}>
                    <Text style={{margin: 1}}>{props.message}</Text>
                </Card>
                <ChatIcon/>
            </View>

        );
    }
    else if (props.type === "User"){
        return (//conditional render icon left or right, style property through props

            <View style={[styles.UserText]}>
                <ChatIcon/>
                <Card containerStyle={{borderRadius: 15}}>
                    <Text style={{margin: 1}}>{props.message}</Text>
                </Card>

            </View>

        );
    }
}

export default ChatBubble;

const styles = StyleSheet.create({
    AIText: {
        display: "flex",
        flexDirection:"row",
        alignItems: "center",
        alignSelf: "flex-end",
        marginRight: 10
    },
    UserText: {
        display: "flex",
        flexDirection:"row",
        alignItems: "center",
        alignSelf: "flex-start",
        marginRight: 10
    }


});