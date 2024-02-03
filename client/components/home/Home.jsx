import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from "react-native";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';


function Home({ handleLogout }) {
    async function onSubmit(){
        try{
            const response = await axios.delete("http://192.168.2.19:4000/auth/SignOut")
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');

            if(response.status === 204){
                handleLogout();
            }
        }catch(err){
            console.log(err)
        }
    }

    return (
        <LinearGradient style={styles.linearGradient} colors={['#150c25', '#222222', 'black']}>
            <TouchableOpacity onPress={onSubmit}  style={styles.loginBtn} >
                <Text>SignOut</Text>
            </TouchableOpacity>
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