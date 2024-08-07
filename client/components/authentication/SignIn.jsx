import React, {useState, useContext} from "react";

import {ImageBackground, StyleSheet, Text, View, TouchableOpacity} from "react-native";
import {TextInput} from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Heading, Button} from "native-base";

import axios from 'axios';
import Global from "../../helperFunctions/Global";
import {ContactContext} from "../../helperFunctions/ContactContext";

const wallpaper = require('../../assets/backgrounds/bk1.png');

function SignIn({navigation }) {
    const { contact, updateContact } = useContext(ContactContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [emailError, setEmailError] = useState("");

    function toggleShowPassword() {
        setShowPassword(!showPassword);
    }
    async function onSubmit() {
        try {
            const response = await axios.post(`${Global.ip}/auth/SignIn`, {
                UserId: email,
                password: password
            });

            if (response.status === 200) {
                const { access, refresh, userName } = response.data;
                const settingsResponse = await axios.get(`${Global.ip}/settings/fetchSettings`, {
                    params: { userName }
                });
                if (settingsResponse.status === 200) {
                    const { theme, notificationsOn, mediumOrder } = settingsResponse.data;
                    await AsyncStorage.setItem('accessToken', access);
                    await AsyncStorage.setItem('refreshToken', refresh);
                    await AsyncStorage.setItem('userName', userName);

                    updateContact({ userName });
                    updateContact({ theme, notificationsOn, mediumOrder });
                    navigation.navigate('Home');
                } else {
                    setEmailError(settingsResponse.data.message || "Failed to fetch user settings");
                }
            } else {
                setEmailError(response.data.message);
            }
        } catch (err) {
            if (err.response) {
                const { status, data } = err.response;
                switch (status) {
                    case 400:
                        setEmailError("*" + data.message); // Handles missing UserId specific error
                        break;
                    case 401:
                        setEmailError("*Invalid login credentials. Please try again.");
                        break;
                    case 500:
                        setEmailError("*Server error. Please try again later.");
                        break;
                    default:
                        setEmailError("*An unexpected error occurred. Please try again.");
                        break;
                }
            } else {
                setEmailError("*Network error or server is down. Please try again later.");
            }
        }
    }



    const goToSignUp = () => {
        navigation.navigate('SignUp');
    };


    return (
        <ImageBackground source={wallpaper} resizeMode="cover" style={styles.Image}>
            <View style={styles.container}>
                <View>
                    <Heading size="3xl" fontWeight="600" color="light.400" style={styles.Header}>
                        Sign-In
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
                        Sign In
                    </Button>
                </View>
                <TouchableOpacity onPress={goToSignUp} style={styles.signup}>
                    <Text style={styles.signupgrey}>
                        Already have an account?
                        <Text style={styles.signupwhite}> Sign up </Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

export default SignIn;

//
const styles= StyleSheet.create({
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