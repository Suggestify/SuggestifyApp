import React, {useContext, useState} from 'react';

import {StyleSheet, Text, TouchableOpacity, View, Switch} from "react-native";
import {Heading, useToast, Box} from 'native-base';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {ContactContext} from "../../helperFunctions/ContactContext";
import api from "../../helperFunctions/Api";

import * as Notifications from 'expo-notifications';
function Settings({navigation}) {
    const { contact, updateContact } = useContext(ContactContext);
    const userName = contact.userName;
    const [notificationsEnabled, setNotificationsEnabled] = useState(contact.notificationOn);
    const [themeEnabled, setThemeEnabled] = useState(contact.theme);
    const toast = useToast();

    async function toggleSwitch(switchType, value ){
        const response = await api.post(`/settings/toggleSwitch`, {
            userName: userName,
            switchType: switchType,
            value: value
        })
        return response;
    }

    async function toggleNotifications() {
        let response = await toggleSwitch("notificationOn", !notificationsEnabled);
        if(response.status === 200){
            await updateContact({notificationOn: !notificationsEnabled});
            await setNotificationsEnabled(!notificationsEnabled);
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
                await api.post(`/settings/setNotifications`, {
                    userName: userName,
                    token: token
                })

            }
            toast.show({
                duration: 1200,
                render: () => {
                    return <Box style={styles.pb} bg="green.50" px="5" py="3" rounded="md" mb={5}>
                        Notifications Enabled
                    </Box>;
                }
            });
        }
        else{
            updateContact({notificationOn: !notificationsEnabled});
            setNotificationsEnabled(contact.notificationsOn);
            toast.show({
                duration: 1200,
                render: () => {
                    return <Box style={styles.pb} bg="red.50" px="5" py="3" rounded="md" mb={5}>
                        Error, PLease Try Again Later
                    </Box>;
                }
            });

        }
    }

    async function toggleTheme (){
        let response = await toggleSwitch("theme",  !themeEnabled);
        if (response.status === 200) {
            updateContact({theme: !themeEnabled});
            setThemeEnabled(!themeEnabled);
            toast.show({
                duration: 1200,
                render: () => {
                    return <Box style={styles.pb} bg="green.50" px="5" py="3" rounded="md" mb={5}>
                        Theme Toggled
                    </Box>;
                }
            });
        }
        else{
            updateContact({theme: !themeEnabled});
            setThemeEnabled(contact.theme);
            toast.show({
                duration: 1200,
                render: () => {
                    return <Box style={styles.pb} bg="red.50" px="5" py="3" rounded="md" mb={5}>
                        Error, Please Try Again Later
                    </Box>;
                }
            });
        }
    }

    async function logout() {
        try {
            const response = await api.delete(`/auth/SignOut`, {
                data: {
                    token: await AsyncStorage.getItem('refreshToken'),
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
        },
        pb: {
            marginBottom: 50,
        },

    }
)