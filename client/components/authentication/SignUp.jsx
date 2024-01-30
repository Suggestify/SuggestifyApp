import React, { useState } from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Button,
    Alert,
    TouchableOpacity,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

function SignUp({navigation}) {
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    function toggleShowPassword() {
        setShowPassword(!showPassword);
    };
    async function onSubmit(){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernameRegex = /^[a-zA-Z0-9]+$/

        if (!emailRegex.test(email)) {
            Alert.alert("Invalid Email", "Please enter a valid email address.");
            return;
        }

        if (!usernameRegex.test(userName)) {
            Alert.alert(
                "Invalid Username",
                "Username can only contain letters and numbers."
            );
            return;
        }

        try {
            const response = await axios.post("http://192.168.2.19:4000/auth/SignUp", {
                email: email,
                userName: userName,
                password: password
            })
            if (response.status !== 200){
                console.log(response.status)

            }else{
                navigation.navigate('Home');
            }
        } catch(err){
            console.log(err)
        }
    }

    const goToLogIn = () => {
        navigation.navigate('LogIn');
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
            </View>
            <View  style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Username"
                    placeholderTextColor = '#696969'
                    onChangeText={(userName) => setUserName(userName)}
                />
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