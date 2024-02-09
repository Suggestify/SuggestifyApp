import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {Avatar, Badge, Icon} from "react-native-elements";
function ChatIcon(props) {
    return (
        <View>
            <Avatar rounded source={{ uri: "https://picsum.photos/id/237/200/300" }}
                    containerStyle={styles.IconStyle} />
        </View>
    );
}

export default ChatIcon;

const styles = StyleSheet.create({
    IconStyle:{
        marginTop: 15
    }
});