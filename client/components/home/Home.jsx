import React, { useState } from 'react';
import {Text, TouchableOpacity, StyleSheet,View} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import ChatPreview from "./ChatPreview";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";

function Home({navigation}) {
    const [myArray, setMyArray] = useState([
        { medium: "Music", color: "#e6194b" , image: require('../../assets/icons/music.png')},
        { medium: "Books", color: "#3cb44b", image: require('../../assets/icons/music.png') },
        { medium: "Podcasts", color: "#ffe119", image: require('../../assets/icons/music.png')  },
        { medium: "Shows", color: "#4363d8", image: require('../../assets/icons/music.png')  },
        { medium: "Movies", color: "#f58231", image: require('../../assets/icons/music.png')  },
        { medium: "Hobbies", color: "#911eb4", image: require('../../assets/icons/music.png')  },
        { medium: "Games", color: "#46f0f0", image: require('../../assets/icons/music.png')  }
    ]);


    function moveToFrontAndShift(arr, index) {
        if (index < 0 || index >= arr.length) {
            return; // Invalid index
        }
        const [item] = arr.splice(index, 1); // Remove the item from the array
        arr.unshift(item); // Add it to the front of the array
    }
    async function onSubmit(){
        navigation.navigate('Settings')
    }
      async function handleClick(index) {
        const userName = await asyncStorage.getItem('userName');
        navigation.navigate('LoadingHome', {userName: userName, medium: myArray[index]});

        moveToFrontAndShift(myArray, index);
        setMyArray([...myArray]);

    }

    return (
        <LinearGradient style={styles.linearGradient} colors={['#150c25', '#222222', 'black']}>
            <View style={styles.header}>
            <Text style={styles.headerText}>Suggestify</Text>
            </View>
            <TouchableOpacity onPress={onSubmit}  style={styles.loginBtn} >
                <Text>Settings</Text>
            </TouchableOpacity>

            <View style={styles.grid}>
                {myArray.map((item, index) => (
                    <TouchableOpacity  key={item.medium}onPress={()=>handleClick(index)} style={styles.chatPreview}>
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
        },
        headerText: {
            color: 'white',
            fontSize: 30,
        },
        linearGradient: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
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
            margin: 10,

        },
    }
)