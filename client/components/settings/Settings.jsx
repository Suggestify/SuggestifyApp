import React, { useState} from 'react';
import * as Notifications from 'expo-notifications';
import {StyleSheet, Text, TouchableOpacity, View, Switch, Alert,} from "react-native";
import {Heading} from 'native-base';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Global from "../Global";

function Settings({route, navigation}) {
    const {userName} = route.params;
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [themeEnabled, setThemeEnabled] = useState(false);

    async function toggleNotifications() {
        let currentEnabledState = !notificationsEnabled;
        setNotificationsEnabled(currentEnabledState);

        if (currentEnabledState) {
            console.log("test");
            const { status } = await Notifications.requestPermissionsAsync({
                ios: {
                    allowAlert: true,
                    allowSound: true,
                    allowBadge: true,
                    allowAnnouncements: true,
                },
            });
            if (status !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            const token = (await Notifications.getExpoPushTokenAsync({
                projectId: '1e87624a-57f3-4080-9cf6-b8b7471ab184' // Replace 'your-username' with your actual Expo username
            })).data;
            console.log(userName);
            const response = await axios.post(`${Global.ip}/settings/setNotifications`, {
                userName: userName,
                token: token
            })
            console.log("response");
            console.log(response);
            if(response.status === 200){
                console.log("Token saved");
                console.log("Token:", token);
            }
            else{
                console.log("Token not saved");
            }

        } else {
            // Optionally handle the case where notifications are turned off
            // e.g., update the database to disable notifications for this user
        }
    }


    const toggleTheme = () => setThemeEnabled(!themeEnabled);

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
                <TouchableOpacity style={styles.settingsOption}>
                    <Text style={styles.settingsOptionText}>Edit Recommendation History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsOption}>
                    <Text style={styles.settingsOptionText}>Buy Premium</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.SettingsSection}>
                <TouchableOpacity  style={styles.settingsOption}>
                    <Text style={styles.settingsOptionText}>Rating & Feedback</Text>
                </TouchableOpacity>
                <TouchableOpacity  style={styles.settingsOption}>
                    <Text style={styles.settingsOptionText}>Contact</Text>
                </TouchableOpacity>
                <View style={styles.settingsOptionToggle}>
                    <Text style={styles.settingsOptionText}>Allow Notifications</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleNotifications}
                        value={notificationsEnabled}
                    />
                </View>
                <View style={styles.settingsOptionToggle}>
                    <Text style={styles.settingsOptionText}>Toggle Theme</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={themeEnabled ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleTheme}
                        value={themeEnabled}
                    />
                </View>
            </View>

            <View style={styles.SettingsSection}>
                <TouchableOpacity style={styles.settingsOption}>
                    <Text style={styles.settingsOptionText}>Forgot your password</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.logOutContainer}>
                <View style={styles.SettingsSection}>
                    <TouchableOpacity onPress={logout} style={styles.settingsOptionLogOut}>
                        <Text style={styles.settingsOptionLogout}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
}

export default Settings;

const styles = StyleSheet.create({
        container: {

            flex: 1,
            backgroundColor: '#000000',
        },
        containerHeader: {
            flexDirection: 'row',  // Ensures horizontal layout
            justifyContent: 'center', // Centers content horizontally
            alignItems: 'center', // Centers content vertically
            paddingTop: 60,
            paddingBottom: 20,
            marginBottom: 20,
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

    settingsOptionLogOut: {
        marginTop: 20,
        paddingBottom: 20,
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
        },
    settingsOptionToggle: {
        marginTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderStyle: "solid",
        borderColor:'#797979',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between', // Aligns items on opposite ends
        alignItems: 'center' // Aligns items vertically
    },
        logOutContainer: {
            flex: 1,
            justifyContent: 'flex-end',
            marginBottom: 36,
        }

    }
)