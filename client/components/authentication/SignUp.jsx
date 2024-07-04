import React, {useState, useContext} from "react";

import {ImageBackground, StyleSheet, Text, View, TouchableOpacity} from "react-native";
import {TextInput} from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Heading, Button} from "native-base";

import axios from 'axios';
import Global from "../../helperFunctions/Global";
import {ContactContext} from "../../helperFunctions/ContactContext";

const wallpaper = require('../../assets/backgrounds/bk2.png');


function SignUp({navigation}) {
    const { contact, updateContact } = useContext(ContactContext);

    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [emailError, setEmailError] = useState("");
    const [userNameError, setUserNameError] = useState("");

    function toggleShowPassword() {
        setShowPassword(!showPassword);
    };

    async function onSubmit() {
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
            console.log("making request")
            const response = await axios.post(`${Global.ip}/auth/SignUp`, {
                email: email,
                userName: userName,
                password: password
            })
            console.log("response.status" + response.status)
            if (response.status !== 200) {
                setEmailError(`*${response.data.message}`)
            } else {
                await AsyncStorage.setItem('tempUserName', userName);
                await AsyncStorage.setItem('verification', "false");
                navigation.navigate('Verify', {userName: userName});
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                if (err.response.data.field === "email") {
                    setEmailError("*An account with that email is already taken");
                }
                if (err.response.data.field === "userName") {
                    setUserNameError("*An account with that username is already taken");
                }
            }
        }
    }

    const goToLogIn = () => {
        navigation.navigate('SignIn');
    };

    return (

        <ImageBackground source={wallpaper} resizeMode="cover" style={styles.Image}>
            <View style={styles.container}>
                <View>
                    <Heading size="3xl" fontWeight="600" color="light.400" style={styles.Header}>
                        Sign-Up
                    </Heading>
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Email"
                        placeholderTextColor='#696969'
                        textColor={"#b7b7b7"}
                        autoCapitalize={"none"}
                        onChangeText={(email) => setEmail(email)}
                    />
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Username"
                        autoCapitalize={"none"}
                        textColor={"#b7b7b7"}
                        placeholderTextColor='#696969'
                        onChangeText={(userName) => setUserName(userName)}
                    />
                    {userNameError ? <Text style={styles.errorText}>{userNameError}</Text> : null}
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Password"
                        placeholderTextColor='#696969'
                        autoCapitalize={"none"}
                        textColor={"#b7b7b7"}
                        secureTextEntry={!showPassword}
                        onChangeText={(password) => setPassword(password)}
                        right={
                            <TextInput.Icon
                                icon={showPassword ? 'eye-off' : 'eye'}
                                onPress={toggleShowPassword}
                                color={"#b7b7b7"}
                            />
                        }
                    />
                </View>
                <Text style={styles.signupwhite}>
                    Forgot Your Password?
                </Text>

                <View
                    style={styles.buttonContainer}>
                    <Button
                        onPress={onSubmit}
                        style={styles.nativeBaseBtn}
                        _text={styles.nativeBaseBtnText}>
                        SignUp
                    </Button>
                </View>
                <TouchableOpacity onPress={goToLogIn} style={styles.signup}>
                    <Text style={styles.signupgrey}>
                       Dont Have an Account?
                        <Text style={styles.signupwhite}> Sign In </Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>

    );
}

export default SignUp;


const styles = StyleSheet.create({
    container: {
        width: "80%",
    },
    Header: {
        paddingLeft: 15,
        marginBottom: 60,
    },
    Image: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonContainer: {
        alignItems: "center"
    },
    errorText: {
        color: 'red',
        alignSelf: 'flex-start', // Aligns text to the start of the inputView
        paddingLeft: 5, // Adjust as needed
    },

    TextInput: {
        color: "white", // This sets the text color to white
        width: '100%',
        marginBottom: 8,
        backgroundColor: "transparent",
        fontSize: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        textAlign: 'left',
    },
    signup: {
        alignItems: "center",
        paddingTop: 50
    },
    signupgrey: {
        color: "#989898"
    },
    signupwhite: {
        color: "white"
    },
    forgot_button: {
        height: 30,
        marginBottom: 30,
        color: "white",
    },
    nativeBaseBtn: {
        width: 290,
        borderRadius: 12,
        marginTop: 40,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderColor: "white",
        borderWidth: 1,
        justifyContent: "center",
    },

    nativeBaseBtnText: {
        fontSize: 20, // Adjust text size as needed
        color: "white", // Adjust text color as needed
    },
});