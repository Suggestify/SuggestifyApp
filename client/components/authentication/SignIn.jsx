import React, {useState} from "react";
import {MaterialCommunityIcons} from '@expo/vector-icons';
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
import {LinearGradient} from 'expo-linear-gradient';

function SignIn({navigation}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    function toggleShowPassword({navigation}) {
        setShowPassword(!showPassword);
    };

    axios.get('http://192.168.2.19:4000/auth')
    Alert.alert("running")
    async function onSubmit() {
        try {

            const response = await axios.post('http://192.168.2.19:4000/auth/SignIn', {
                UserId: email,
                password: password
            })
            if (response.status !== 200) {
                console.log()

            } else {
                navigation.navigate('Home');
            }
        } catch (err) {
            console.log(err)
        }
    }


    const goToSignUp = () => {
        navigation.navigate('SignUp');
    };


    return (
        <LinearGradient style={styles.linearGradient} colors={['rgba(255,147,56,0.8)', '#222222', 'black']}>
            <Image style={styles.image} source={require('../../assets/Logo.png')}/>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Username or Email"
                    placeholderTextColor='#696969'
                    onChangeText={(email) => setEmail(email)}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Password"
                    placeholderTextColor='#696969'
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
                <Text style={styles.loginText}>SignIn</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToSignUp} style={styles.signup}>
                <Text style={styles.signupgrey}>
                    Don't have an account?
                    <Text style={styles.signupwhite}> Sign up </Text>
                </Text>
            </TouchableOpacity>
        </LinearGradient>
    );
}

export default SignIn;

//
const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    inputView: {
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
    signup: {
        paddingTop: 50
    },
    signupgrey: {
        color: "#989898"
    },
    signupwhite: {
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
        backgroundColor: "#e71bdd",
    },
});