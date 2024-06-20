import React, {useContext, useEffect} from 'react';

import { Text, View } from "react-native";
import {Heading, HStack, Spinner} from "native-base";

import { ContactContext } from "../../helperFunctions/ContactContext";
import api from "../../helperFunctions/Api";



function Loading({route, navigation }) {
    const { contact, updateContact } = useContext(ContactContext);
    const userName = contact.userName;
    const { medium } = route.params;
    async function pullChat(){
        try {
            const response = await api.get(`/ai/fetchMessages`, {
                params: {
                    userName: userName,
                    chatType: medium
                }
            })
            if (response.status === 200) {
                navigation.navigate("ChatScreen", {
                    userName: userName,
                    medium: medium,
                    chatHistory: response.data
                })
            } else {
                console.log("error" + response.status)
            };
        }catch (err){
            console.log(err)
        }
    }

    useEffect(() => {
        pullChat();
    }, [navigation]);

    const SpinnerComp = () => {
        return <HStack space={2} justifyContent="center">
            <Spinner accessibilityLabel="Loading posts" />
            <Heading color="primary.500" fontSize="xl">
            </Heading>
        </HStack>;
    };

    return (
        <View style={styles.container}>
            <SpinnerComp />
            <Text style={styles.text}>Loading...</Text>
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    text: {
        fontSize: 24,
        color: '#333',
    }
};

export default Loading;
