import React, {useState, useContext} from 'react';
import {Text, TouchableOpacity, Image, StyleSheet, View} from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import ChatPreview from "./ChatPreview";
import { ContactContext } from "../../ContactContext";
import axios from "axios";
import Global from "../Global";

function Home({navigation}) {

    const { contact, updateContact } = useContext(ContactContext);
    const userName = contact.userName
    console.log(contact.mediumOrder);
    const order = contact.mediumOrder;
    const initialArray = [
        { medium: "Music", color: "#e6194b", image: require('../../assets/icons/Music.png') },
        { medium: "Books", color: "#3cb44b", image: require('../../assets/icons/Books.png') },
        { medium: "Podcast", color: "#ffe119", image: require('../../assets/icons/Podcasts.png') },
        { medium: "Shows", color: "#4363d8", image: require('../../assets/icons/Shows.png') },
        { medium: "Movies", color: "#f58231", image: require('../../assets/icons/Movies.png') },
        { medium: "Hobbies", color: "#911eb4", image: require('../../assets/icons/Hobbies.png') },
        { medium: "Games", color: "#46f0f0", image: require('../../assets/icons/Games.png') }
    ];

    const [myArray, setMyArray] = useState(reorderArray(initialArray, order));


    function reorderArray(arr, order) {
        const newArr = [];
        order.forEach(o => {
            const found = arr.find(item => item.medium === o);
            if (found) {
                newArr.push(found);
            }
        });
        return newArr;
    }
    function moveToFrontAndShift(arr, index) {
        if (index < 0 || index >= arr.length) {
            return; // Invalid index
        }
        const [item] = arr.splice(index, 1); // Remove the item from the array
        arr.unshift(item); // Add it to the front of the array
    }
    async function onSubmit() {
        navigation.navigate('Settings', {userName: userName});
    }

    async function handleClick(index) {
        const medium = myArray[index].medium;
        moveToFrontAndShift(myArray, index);
        await axios.put(`${Global.ip}/settings/updateOrder`, {
            userName: userName,
            newOrder: myArray.map(item => item.medium)
        })
        setMyArray([...myArray]);
        navigation.navigate('LoadingHome', {medium: medium});
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
