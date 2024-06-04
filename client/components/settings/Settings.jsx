import React, {useContext, useState} from 'react';
import * as Notifications from 'expo-notifications';
import {StyleSheet, Text, TouchableOpacity, View, Switch, Alert,} from "react-native";
import {Heading} from 'native-base';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Global from "../Global";
import Toast from "react-native-toast-message";
import {ContactContext} from "../../ContactContext";

function Settings({navigation}) {
    const { contact, updateContact } = useContext(ContactContext);
    const userName = contact.userName;
    const [notificationsEnabled, setNotificationsEnabled] = useState(contact.notificationsOn);
    const [themeEnabled, setThemeEnabled] = useState(contact.theme);

    async function toggleSwitch(switchType, value ){
        const response = await axios.post(`${Global.ip}/settings/toggleSwitch`, {
            userName: userName,
            switchType: switchType,
            value: value
        })
        return response;
    }

    async function toggleNotifications() {
        contact.notificationsOn = !notificationsEnabled;
        setNotificationsEnabled(contact.notificationsOn);
        let response = await toggleSwitch("notificationOn", contact.notificationsOn);
        if(response.status === 200){
            if (response.data.firstTime) {
                const {status} = await Notifications.requestPermissionsAsync({
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
                await axios.post(`${Global.ip}/settings/setNotifications`, {
                    userName: userName,
                    token: token
                })

            }
            Toast.show({
                type: 'success', // There are 'success', 'error', 'info' types available by default
                text1: 'Settings Updated',
                text2: 'Your changes have been saved successfully.'
            });
        }
        else{
            contact.notificationsOn = !notificationsEnabled;
            setNotificationsEnabled(contact.notificationsOn);
            Toast.show({
                type: 'error', // There are 'success', 'error', 'info' types available by default
                text1: 'Settings Not Updated',
                text2: 'Your changes have not been saved successfully.'
            });

        }
    }

    async function toggleTheme (){
        contact.theme = !themeEnabled;
        setThemeEnabled(contact.theme);
        let response = await toggleSwitch("theme",  !contact.theme);
        if (response.status === 200) {
            Toast.show({
                type: 'success', // There are 'success', 'error', 'info' types available by default
                text2: 'Your changes have been saved successfully.'
            });
        }
        else{
            contact.theme = !themeEnabled;
            setThemeEnabled(contact.theme);
            Toast.show({
                type: 'error', // There are 'success', 'error', 'info' types available by default
                text2: 'Your changes have not been saved successfully.'
            });
        }
    }

    async function logout() {
        try {
            const response = await axios.delete(`${Global.ip}/auth/SignOut`, {
                data: {
                    userName: userName
                }
            })
            if (response.status === 204) {
                await AsyncStorage.clear();

                navigation.navigate('SignIn')
            }
        } catch (err) {
            console.log(err)
        }
    }

    function backToHome() {
        navigation.navigate('Home')
    }

    function preferenceReset() {
        navigation.navigate('PreferenceSettings')
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
                <TouchableOpacity style={[styles.settingsOption, styles.settingsBorder]} onPress={preferenceReset}>
                    <Text style={styles.settingsOptionText}>Reset Preference</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsOption} >
                    <Text style={styles.settingsOptionText}>Buy Premium</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.SettingsSection}>
                <TouchableOpacity  style={[styles.settingsOption, styles.settingsBorder]}>
                    <Text style={styles.settingsOptionText}>Rating & Feedback</Text>
                </TouchableOpacity>
                <TouchableOpacity  style={[styles.settingsOption, styles.settingsBorder]}>
                    <Text style={styles.settingsOptionText}>Contact</Text>
                </TouchableOpacity>
                <View style={[styles.settingsOptionToggle, styles.settingsBorder]}>
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
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
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
            alignSelf: 'center',
            borderRadius: "20%",
            marginTop: 20,
            width: "95%",
            backgroundColor: '#1f1f1f',
        },
        settingsOption: {
            marginTop: 20,
            paddingBottom: 20,
            paddingLeft: 20,
            borderStyle: "solid",
            borderColor:'#797979',
        },

        settingsBorder:{
            borderBottomWidth: 1,
            borderColor:'#797979',
        },

        settingsOptionLogOut: {
            marginTop: 20,
            paddingBottom: 20,
            borderStyle: "solid",
            borderColor:'#797979',
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