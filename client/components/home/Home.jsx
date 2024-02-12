import React, { useState } from 'react';
import {Text, TouchableOpacity, StyleSheet} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import ChatPreview from "./ChatPreview";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";

function Home({navigation}) {
    const [myArray, setMyArray] = useState(["Music", "Books", "Podcasts", "Shows", "Movies", "Hobbies", "Games"]);

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
    function handleClick(index) {
        return () => {
            moveToFrontAndShift(myArray, index);
            setMyArray([...myArray]);
        };
    }

    return (
        <LinearGradient style={styles.linearGradient} colors={['#150c25', '#222222', 'black']}>
            <TouchableOpacity onPress={onSubmit}  style={styles.loginBtn} >
                <Text>Settings</Text>
            </TouchableOpacity>
            {myArray.map((item, index) => (
                <TouchableOpacity key={item} onPress={handleClick(index)} >
                    <ChatPreview medium={item}/>
                </TouchableOpacity>

            ))}
        </LinearGradient>
    );
}

export default Home;

const styles = StyleSheet.create({
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
        marginTop: 40,
        backgroundColor: "#FF1493",
    }
    }
)