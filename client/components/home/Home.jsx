import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from "react-native";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';


function Home({ isAuthenticated, setIsAuthenticated }) {
    async function onSubmit(){
        try{
            console.log("ca")
            const response = await axios.delete("http://192.168.2.18:4000/auth/SignOut")
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            console.log(isAuthenticated)
            if(response.status === 204){

                setIsAuthenticated(false);
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