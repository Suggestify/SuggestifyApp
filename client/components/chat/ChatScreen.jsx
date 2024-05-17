import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, FlatList } from 'react-native';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';

function ChatScreen({ route, navigation }) {
    const [currHistory, setCurrHistory] = useState([]);
    const type = route.params.medium;
    const flatListRef = useRef(null);

    useEffect(() => {
        const initialHistory = route.params.chatHistory.map((message, index) => ({
            id: index,
            message: message,
            type: index % 2 === 0 ? 'AI' : 'User',
        }));
        setCurrHistory(initialHistory);
    }, [route.params.chatHistory]);

    useEffect(() => {
        const scrollTimeout = setTimeout(() => {
            if (flatListRef.current) {
                console.log('Scrolling to end');
                flatListRef.current.scrollToEnd({ animated: true });
            }
        }, 200);

        return () => clearTimeout(scrollTimeout);
    }, [currHistory]);

    function updateHistory(newMessage, type) {
        console.log('updating history' + type + ' ' + newMessage);
        setCurrHistory((currentHistory) => [
            ...currentHistory,
            { id: currentHistory.length, message: newMessage, type: type },
        ]);
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={currHistory}
                renderItem={({ item }) => (
                    <ChatBubble message={item.message} type={item.type} />
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.flatListContent}
                ListFooterComponent={<View style={ styles.footer } />}
            />
            <View style={styles.inputContainer}>
                <ChatInput chatType={type} onUpdate={updateHistory} />
            </View>
        </SafeAreaView>
    );
}

export default ChatScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#525252',
    },
    flatListContent: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    inputContainer: {
        justifyContent: 'flex-end',
        width: '100%',
        backgroundColor: '#525252', // Ensure the input container is visible
    },
    footer: {
        height: 10,
    }
});
