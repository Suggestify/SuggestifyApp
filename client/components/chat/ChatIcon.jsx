import React from 'react';

import {StyleSheet, View} from "react-native";
import {Avatar} from "react-native-elements";
function ChatIcon() {
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