import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

function ChatPreview({medium}) {
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEnpd5ycoub6rrq7MivNaU33SBONAHLxnLVw&usqp=CAU' }} // Replace with your image URL
                style={styles.image}
            />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{medium}</Text>
                <Text style={styles.text}>Some description text goes here...</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: "white",
        borderStyle: "solid",
        borderColor: "Black",
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    textContainer: {
        flexDirection: 'column',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    text: {
        fontSize: 14,
    },
});

export default ChatPreview;