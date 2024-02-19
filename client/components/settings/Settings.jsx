import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Switch, Alert,} from "react-native";
import {Heading} from 'native-base';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Global from "../Global";

function Settings({navigation}) {
    const userName = AsyncStorage.getItem("userName")
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    async function logout() {
        try {
            const response = await axios.delete(`${Global.ip}/auth/SignOut`)
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            if (response.status === 204) {
                navigation.navigate('SignIn')
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function changeUserName() {
        try {
            const response = await axios.put(`${Global.ip}/auth/changeUsername`, {
                newUsername: newUsername,
                currUsername: userName
            })
            if (response.status === 200) {
                Alert.alert("Username changed successfully");
            } else {
                Alert.alert(response.data.message);
            }
        } catch (err) {
            Alert.alert("Error", "Failed to change username");
        }
    }

    function backToHome() {
        navigation.navigate('Home')
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <TouchableOpacity onPress={backToHome} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>&lt;</Text>
                </TouchableOpacity>
                <Heading style={styles.header} size="md" fontSize={50} bold color={"white"}>
                    Settings
                </Heading>
            </View>
            <View style={styles.SettingsSection}>
                <TouchableOpacity onPress={changeUserName} style={styles.settingsOption}>
                    <Text style={styles.settingsOptionText}>Change Username</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={changeUserName} style={styles.settingsOption}>
                    <Text style={styles.settingsOptionText}>Forgot your password</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={changeUserName} style={styles.settingsOption}>
                    <Text style={styles.settingsOptionText}>Buy Premium</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.SettingsSection}>

                <TouchableOpacity onPress={changeUserName} style={styles.settingsOption}>
                    <Text style={styles.settingsOptionText}>Notification Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={changeUserName} style={styles.settingsOption}>
                    <Text style={styles.settingsOptionText}>Edit Recommendation History</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={changeUserName} style={styles.settingsOption}>
                    <Text style={styles.settingsOptionText}>Rating & Feedback</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={changeUserName} style={styles.settingsOption}>
                    <Text style={styles.settingsOptionText}>Contact</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={changeUserName} style={styles.settingsOption}>
                    <Switch
                        // trackColor={{false: '#767577', true: '#81b0ff'}}
                        // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                    <Text style={styles.settingsOptionText}>Toggle Theme</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.SettingsSection}>
                <TouchableOpacity onPress={logout} style={styles.settingsOption}>
                    <Text style={styles.settingsOptionLogout}>Logout</Text>
                </TouchableOpacity>
            </View>

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
        container: {
            flex: 1,
            backgroundColor: '#000000',
        },
        header: {
            paddingLeft: 15,
            textAlign: "center",
        },
        containerHeader: {
            flexDirection: 'row',
            paddingTop: 60,
            backgroundColor: '#1f1f1f',
        },
        backBtn: {
            display: "flex",
            color: "white",
            borderRadius: 50,
        },
        backBtnText: {
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            paddingLeft: 10,
            paddingRight: 10,
        },
        SettingsSection: {
            marginTop: 20,
            backgroundColor: '#1f1f1f',
        },
        settingsOption: {
            marginTop: 20,
            paddingBottom: 20,
            paddingLeft: 20,
            borderStyle: "solid",
            borderColor:'#797979',
            borderBottomWidth: 1,
        },
        settingsOptionText: {
            color: '#afafaf',
            fontSize: 20,
        },
        settingsOptionLogout: {
            color: '#afafaf',
            fontSize: 25,
            fontWeight: 'bold',
            textDecorationLine: 'underline',
            textAlign: "center",
        }
    }
)