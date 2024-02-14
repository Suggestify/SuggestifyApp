import React, { useState } from "react";
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Global from "../Global";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";

function SignUp({navigation}) {
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [userNameError, setUserNameError] = useState("");


    function toggleShowPassword() {
        setShowPassword(!showPassword);
    };
    async function onSubmit(){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernameRegex = /^[a-zA-Z0-9]+$/

        if (!emailRegex.test(email)) {
            setEmailError("*Please enter a valid email address.");
            return;
        } else {
            setEmailError("");
        }

        if (!usernameRegex.test(userName)) {
            setUserNameError("*Username can only contain letters and numbers.");
            return;
        } else {
            setUserNameError("");
        }
        try {
            const response = await axios.post(`${Global.ip}/auth/SignUp`, {
                email: email,
                userName: userName,
                password: password
            })
            if (response.status !== 200){
                console.log(response.status)

            }else{
                const accessToken = response.data.access;
                const refreshToken = response.data.refresh;
                const userName = response.data.userName;

                await AsyncStorage.setItem('accessToken', accessToken);
                await AsyncStorage.setItem('refreshToken', refreshToken);
                await AsyncStorage.setItem('userName', userName);
                navigation.navigate('Preference');
            }
        } catch(err){
            if (err.response && err.response.status === 400) {
                if(err.response.data.field === "email"){
                    setEmailError("*An account with that email is already taken");
                }
                if(err.response.data.field === "userName"){
                    setUserNameError("*An account with that username is already taken");
                }
            }
        }
    }

    const goToLogIn = () => {
        navigation.navigate('SignIn');
    };

    return (
        <LinearGradient  style={styles.linearGradient} colors={['#150c25', '#222222', 'black']}>
            <Image style={styles.image} source={require('../../assets/Logo.png')} />
            <View  style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder=" Email"
                    placeholderTextColor = '#696969'
                    onChangeText={(email) => setEmail(email)}
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>
            <View  style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Username"
                    placeholderTextColor = '#696969'
                    onChangeText={(userName) => setUserName(userName)}
                />
                {userNameError ? <Text style={styles.errorText}>{userNameError}</Text> : null}
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Password"
                    placeholderTextColor = '#696969'
                    secureTextEntry={!showPassword}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>
            <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#aaa"
                style={styles.icon}
                onPress={toggleShowPassword}
            />


            <TouchableOpacity onPress={onSubmit} style={styles.loginBtn}>
                <Text style={styles.loginText}>SignUp</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToLogIn} style={styles.signup}>
                <Text style={styles.signupgrey}>
                    Don't have an account?
                    <Text style={styles.signupwhite}> Sign up </Text>
                </Text>
            </TouchableOpacity>
        </LinearGradient>
    );
}

export default SignUp;


const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    inputView:{
        width: 300,
        alignItems: "center",
        justifyContent: "center",
    },
    errorText: {
        color: 'red',
        alignSelf: 'flex-start', // Aligns text to the start of the inputView
        paddingLeft: 10, // Adjust as needed
    },

    TextInput: {
        color: "white",
        width: '100%',
        margin: 10,
        padding: 15,
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#fff',

    },
    signup:{
        paddingTop: 50
    },
    signupgrey:{
        color:  "#989898"
    },
    signupwhite:{
        color: "white"
    },
    image: {
        width: 120,
        resizeMode: 'contain',
    },

    forgot_button: {
        height: 30,
        marginBottom: 30,
        color: "white",
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
});