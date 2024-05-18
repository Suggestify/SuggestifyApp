import React, {useState} from 'react';
import {Text, TouchableOpacity, Image, StyleSheet, View} from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import ChatPreview from "./ChatPreview";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Home({navigation}) {
    const [myArray, setMyArray] = useState([        { medium: "Music", color: "#e6194b", image: require('../../assets/icons/music.png') },
    { medium: "Books", color: "#3cb44b", image: require('../../assets/icons/Books.png') },
    { medium: "Podcasts", color: "#ffe119", image: require('../../assets/icons/Podcasts.png') },
    { medium: "Shows", color: "#4363d8", image: require('../../assets/icons/Shows.png') },
    { medium: "Movies", color: "#f58231", image: require('../../assets/icons/Movies.png') },
    { medium: "Hobbies", color: "#911eb4", image: require('../../assets/icons/Hobbies.png') },
    { medium: "Games", color: "#46f0f0", image: require('../../assets/icons/Games.png') }]);


    function moveToFrontAndShift(arr, index) {
        if (index < 0 || index >= arr.length) {
            return; // Invalid index
        }
        const [item] = arr.splice(index, 1); // Remove the item from the array
        arr.unshift(item); // Add it to the front of the array
    }
    async function onSubmit() {
        const userName = await AsyncStorage.getItem('userName');
        navigation.navigate('Settings', {userName: userName});
    }

    async function handleClick(index) {
        const userName = await AsyncStorage.getItem('userName');
        navigation.navigate('LoadingHome', {userName: userName, medium: myArray[index].medium});

        moveToFrontAndShift(myArray, index);
        setMyArray([...myArray]);

    }

    return (
        <LinearGradient style={styles.linearGradient} colors={['#150c25', '#222222', 'black']}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Suggestify</Text>
                <TouchableOpacity onPress={onSubmit}>
                    <Image
                        source={require('../../assets/icons/profile.png')}
                        style={styles.imageStyle} // You can define styles for your image in your stylesheet
                    />
                </TouchableOpacity>
            </View>


            <View style={styles.grid}>
                {myArray.map((item, index) => (
                    <TouchableOpacity key={item.medium} onPress={() => handleClick(index)} style={styles.chatPreview}>
                        <ChatPreview medium={item.medium} color={item.color} image={item.image}/>
                    </TouchableOpacity>
                ))}
            </View>
        </LinearGradient>
    );
}

export default Home;

const styles = StyleSheet.create({
        header: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
        },
        headerText: {
            color: '#adadad',
            fontSize: 40,
        },
        linearGradient: {
            paddingTop: 50,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 10,
        },
        loginBtn: {
            width: "80%",
            borderRadius: 25,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FF1493",

        },
        grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            width: '100%',
            marginTop: 25,
        },
        chatPreview: {
            width: '45%', // Adjust width for two columns
            marginHorizontal: 10,
            marginVertical: 15,

        },
        imageStyle: {
            width: 50,
            height: 50,
        }
    }
)
