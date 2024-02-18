import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

function ChatPreview({medium, color, image}) {
    return (
        <View style={[styles.container, { backgroundColor: color }]}>
            <Image
                source={image} // Replace with your image URL
                style={styles.image}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%', // Ensure the container takes up the full width of the parent
    },
    image: {
        width: 50,
        height: 50,
        marginBottom: 10, // Space between the image and text
    },
});

export default ChatPreview;