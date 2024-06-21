import React, { useContext, useEffect, useState } from 'react';

import { Text, View } from "react-native";
import { Heading, HStack, Spinner } from "native-base";

import { ContactContext } from "../../helperFunctions/ContactContext";
import api from "../../helperFunctions/Api";


function LoadingPreference({ route, navigation }) {
    const { contact, updateContact } = useContext(ContactContext);
    const userName = contact.userName;
    const allChoices = route.params.allChoices;
    const [allGood, setAllGood] = useState(true);
    const medium = ["Music", "Books", "Shows", "Podcasts", "Movies", "Hobbies", "Games"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requests = allChoices.map((choice, index) => {
                    return api.post('/ai/create', {
                        userName: userName,
                        medium: medium[index],
                        options: choice
                    });
                });

                const responses = await Promise.all(requests);
                const allResponsesGood = responses.every(response => response.status === 200);

                if (allResponsesGood) {
                    navigation.navigate("Home");
                } else {
                    setAllGood(false);
                }
            } catch (err) {
                console.log(err);
                setAllGood(false);
            }
        };

        fetchData();
    }, [allChoices, medium, navigation, userName]);


    const SpinnerComp = () => (
        <HStack space={2} justifyContent="center">
            <Spinner accessibilityLabel="Loading posts" />
            <Heading color="primary.500" fontSize="xl"></Heading>
        </HStack>
    );

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

export default LoadingPreference;
