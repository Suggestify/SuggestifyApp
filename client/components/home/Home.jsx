import React, {useState, useContext, useEffect} from 'react';

import { TouchableOpacity, Image, StyleSheet, View, ScrollView, ImageBackground} from "react-native";
import {Box, Heading, useToast} from 'native-base';

import { ContactContext } from "../../helperFunctions/ContactContext";
import api from "../../helperFunctions/Api";

import ChatPreview from "./ChatPreview";

import wallpaperD from "../../assets/backgrounds/wallpaperD.png";
import wallpaperL from "../../assets/backgrounds/wallpaperL.png";


function Home({navigation}) {
    const { contact, updateContact } = useContext(ContactContext);
    const userName = contact.userName
    const order = contact.mediumOrder;
    const [theme, setTheme] = useState(contact.theme);
    const wallpaper = theme ? wallpaperD : wallpaperL;
    const toast = useToast();

    useEffect(() => {
        setTheme(contact.theme); // Update theme when it changes in context
    }, [contact.theme]);

    const getColours = (isDark) => {
        return isDark ? ["#593232", "#204823", "#6b6831", "#273052", "#6b412a", "#4c2756", "#204949"]
            : ["#ff9595", "#9cffa2", "#fff995", "#8fa4ff", "#ffb08b", "#e69bff", "#93ffff"];
    };

    const initialArray = [
        { medium: "Music", iconLight: require('../../assets/icons/MusicL.png'), iconDark: require('../../assets/icons/MusicD.png') },
        { medium: "Books", iconLight: require('../../assets/icons/BooksL.png'), iconDark: require('../../assets/icons/BooksD.png') },
        { medium: "Podcasts", iconLight: require('../../assets/icons/PodcastsL.png'), iconDark: require('../../assets/icons/PodcastsD.png') },
        { medium: "Shows", iconLight: require('../../assets/icons/ShowsL.png'), iconDark: require('../../assets/icons/ShowsD.png') },
        { medium: "Movies", iconLight: require('../../assets/icons/MoviesL.png'), iconDark: require('../../assets/icons/MoviesD.png') },
        { medium: "Hobbies", iconLight: require('../../assets/icons/HobbiesL.png'), iconDark: require('../../assets/icons/HobbiesD.png') },
        { medium: "Games", iconLight: require('../../assets/icons/GamesL.png'), iconDark: require('../../assets/icons/GamesD.png') }
    ];

    const [myArray, setMyArray] = useState(reorderArray(initialArray, order));

    function reorderArray(arr, order) {
        const colours = getColours(theme); // Get colors based on theme
        return order.map(medium => {
            const found = arr.find(item => item.medium === medium);
            return {
                ...found,
                color: colours[arr.indexOf(found)],
                image: theme ? found.iconDark : found.iconLight}; // Append color dynamically
        });
    }

    useEffect(() => {
        setMyArray(reorderArray(initialArray, order)); // Recompute when theme or order changes
    }, [theme, order]);
    function moveToFrontAndShift(arr, index) {
        if (index < 0 || index >= arr.length) {
            return arr; // Return the original array if index is invalid
        }
        const newArr = [...arr];
        const item = newArr.splice(index, 1)[0]; // Remove the item and get it
        newArr.unshift(item); // Add it to the front of the array
        return newArr;
    }
    async function onSubmit() {
        navigation.navigate('Settings');
    }

    async function handleClick(index) {
        const medium = myArray[index].medium;
        const updatedArray = moveToFrontAndShift(myArray, index); // Get the updated array
        setMyArray(updatedArray); // Set state with the updated array

        try {
            const response = await api.put(`/settings/updateOrder`, {
                userName: userName,
                newOrder: updatedArray.map(item => item.medium)
            });
            if(response.status !== 200) {
                showToast("error please try again later");
            }
            else {
                navigation.navigate('LoadingHome', {medium: medium});
            }
        } catch (error) {
            console.error('Failed to update order:', error);
        }
    }

    function showToast(message) {
        toast.show({
            duration: 1100,
            render: () => {
                return <Box style={styles.pb} bg={ "error.100"} px="5" py="3" rounded="md" mb={5}>
                    {message}
                </Box>;
            }
        });
    }

    return (
        <ImageBackground  source={wallpaper} resizeMode="cover" style={styles.linearGradient}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.header}>
                    <Heading fontSize={'4xl'} color={theme ? `trueGray.300` : `trueGray.600`}>Suggestify</Heading>
                    <TouchableOpacity onPress={onSubmit}>
                        <Image
                            source={require('../../assets/icons/profile.png')}
                            style={styles.imageStyle} // You can define styles for your image in your stylesheet
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.container2}>
                    {myArray.map((item, index) => (
                        <TouchableOpacity key={item.medium} onPress={() => handleClick(index)} style={styles.chatPreview}>
                            <ChatPreview medium={item.medium} color={item.color} image={item.image}/>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

export default Home;

const styles = StyleSheet.create({
    header: {
        width: '85%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 30
    },
    headerText: {
        color: '#adadad',
        fontSize: 40,
    },
    linearGradient: {
        flex: 1, // This ensures the gradient fills the screen
    },
    scrollViewContainer: {
        paddingTop: 100,
        flexGrow: 1,
        alignItems: 'center',
    },

    imageStyle: {
        width: 50,
        height: 50,
    },
    container2:{
        width: '100%',
        alignItems: 'center',
        justifyContent: "center"

    },
    chatPreview:{
        paddingBottom: 8
    }
});
