import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from "react-native";
import {Button, Header, Icon} from "react-native-elements";
import ChatIcon from "./ChatIcon";
import ChatBubble from "./ChatBubble";

function ChatScreen(props) {

    let test = [
        {type: "User", message: "Hello bob", id: 1},
        {type: "AI", message: "sup shmungi", id:2}
    ]

    return ( // pass in props for menu
        <SafeAreaView>
        <View style={styles.inputView}>
            <Header leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
                    rightComponent={{ icon: 'home', color: '#fff' }}/>
        </View>

            <View>
                {test.map((item) => (
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