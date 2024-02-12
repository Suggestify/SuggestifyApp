import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Switch, Alert,} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
function Settings({navigation}) {
    const userName = AsyncStorage.getItem("userName")
    const [isEnabled, setIsEnabled] = useState(false);
    const myArray = ["Music", "Books", "Podcasts", "Shows", "Movies", "Hobbies", "Games"];

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    async function logout(){
        try{
            const response = await axios.delete("http://192.168.2.18:4000/auth/SignOut")
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            if(response.status === 204){
                navigation.navigate('SignIn')
            }
        }catch(err){
            console.log(err)
        }
    }

    async function changeUserName(){
        try{
            const response = await axios.put("http://192.168.2.18:4000/auth/changeUsername",{
                newUsername: newUsername,
                currUsername: userName
            })
            if(response.status === 200){
                Alert.alert("Username changed successfully");
            }
            else{
                Alert.alert(response.data.message);
            }
        }catch(err){
            Alert.alert("Error", "Failed to change username");
        }
    }
    function backToHome(){
        navigation.navigate('Home')
    }

    return (
        <View>
            <TouchableOpacity onPress={backToHome}  style={styles.loginBtn} >
                <Text>back to home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtn} >
                <Text>Buy Premium</Text>
            </TouchableOpacity>
            <Switch
               // trackColor={{false: '#767577', true: '#81b0ff'}}
               // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
            />
            {myArray.map((item, index) => (
                <Text key={item} >
                    Edit {item} Settings
                </Text>
            ))}
            <Text>Forgot Your Password</Text>
            <TouchableOpacity onPress={changeUserName}  style={styles.loginBtn} >
                <Text>Change Username</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={logout}  style={styles.loginBtn} >
                <Text>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

export default Settings;

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
        },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    }
)