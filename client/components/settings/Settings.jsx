import React, {useContext, useState} from 'react';

import {StyleSheet, TouchableOpacity, View, Switch, Image} from "react-native";
import {Heading, useToast, Box, Text} from 'native-base';
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
        await setNotificationsEnabled(!notificationsEnabled);
        let response = await toggleSwitch("notificationOn", !contact.notificationOn);
        if(response.status === 200) {
            await updateContact({notificationOn: !contact.notificationOn});
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
            if (notificationsEnabled) {
                toast.show({
                duration: 1200,
                render: () => {
                    return <Box style={styles.pb} bg="error.100" px="5" py="3" rounded="md" mb={5}>
                        Notifications Disabled
                    </Box>;
                }
                });
            }
            else if (!notificationsEnabled){
                toast.show({
                    duration: 1200,
                    render: () => {
                        return <Box style={styles.pb} bg="success.100" px="5" py="3" rounded="md" mb={5}>
                            Notifications Enabled
                        </Box>;
                    }
                });
            }
        }
        else{
            updateContact({notificationOn: !notificationsEnabled});
            setNotificationsEnabled(contact.notificationsOn);
            toast.show({
                duration: 1200,
                render: () => {
                    return <Box style={styles.pb} bg="error.400" px="5" py="3" rounded="md" mb={5}>
                        Error, PLease Try Again Later
                    </Box>;
                }
            });

        }
    }

    async function toggleTheme (){
        console.log(themeEnabled)
        setThemeEnabled(!themeEnabled);
        let response = await toggleSwitch("theme",  !contact.theme);
        if (response.status === 200) {
            updateContact({theme: !contact.theme});
            toast.show({
                duration: 1200,
                render: () => {
                    return <Box style={styles.pb} bg="success.100" px="5" py="3" rounded="md" mb={5}>
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
                    return <Box style={styles.pb} bg="error.400" px="5" py="3" rounded="md" mb={5}>
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
        <Box style={styles.container} bg={themeEnabled ? `black` : `light.200`}>
            <Box style={styles.containerHeader} bg={themeEnabled ? 'trueGray.900' : 'white'}>
                <TouchableOpacity onPress={backToHome} style={styles.backBtn}>
                    <Image
                        source={themeEnabled ? require('../../assets/icons/previousD.png') : require('../../assets/icons/previousL.png')}
                        style={styles.backBtnImg}
                    />
                </TouchableOpacity>
                <View style={styles.headingContainer}>
                    <Heading size="md" fontSize={50} bold color={themeEnabled ? 'trueGray.300' : 'trueGray.600'}>
                        Settings
                    </Heading>
                </View>
            </Box>
            <Box style={styles.SettingsSection} bg={themeEnabled ? `trueGray.900` : `white`}>
                <TouchableOpacity style={[styles.settingsOption, styles.settingsBorder]} onPress={preferenceReset}>
                    <Text color={themeEnabled ? `trueGray.300` : `darkText`} style={styles.settingsOptionText}>Reset Preference</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsOption} >
                    <Text color={themeEnabled ? `trueGray.300` : `darkText`} style={styles.settingsOptionText}>Buy Premium</Text>
                </TouchableOpacity>
            </Box>

            <Box style={styles.SettingsSection} bg={themeEnabled ? `trueGray.900` : `white`}>
                <TouchableOpacity  style={[styles.settingsOption, styles.settingsBorder]}>
                    <Text color={themeEnabled ? `trueGray.300` : `darkText`} style={styles.settingsOptionText}>Rating & Feedback</Text>
                </TouchableOpacity>
                <TouchableOpacity  style={[styles.settingsOption, styles.settingsBorder]}>
                    <Text color={themeEnabled ? `trueGray.300` : `darkText`} style={styles.settingsOptionText}>Contact</Text>
                </TouchableOpacity>
                <View style={[styles.settingsOptionToggle, styles.settingsBorder]}>
                    <Text color={themeEnabled ? `trueGray.300` : `darkText`} style={styles.settingsOptionText}>Allow Notifications</Text>
                    <Switch
                        trackColor={{  true: '#6ed02b' }}
                        ios_backgroundColor='#DADADAFF'
                        onValueChange={toggleNotifications}
                        value={notificationsEnabled}
                    />
                </View>
                <View style={styles.settingsOptionToggle}>
                    <Text color={themeEnabled ? `trueGray.300` : `darkText`} style={styles.settingsOptionText}>Toggle Theme</Text>
                    <Switch
                        trackColor={{  true: '#6ed02b' }}
                        ios_backgroundColor='#DADADAFF'
                        onValueChange={toggleTheme}
                        value={themeEnabled}
                    />
                </View>
            </Box>

            <View style={styles.logOutContainer} >
                <Box style={styles.SettingsSection} bg={themeEnabled ? `trueGray.900` : `white`}>
                    <TouchableOpacity onPress={logout} style={styles.settingsOptionLogOut}>
                        <Heading color={themeEnabled ? `trueGray.300` : `darkText`} style={styles.settingsOptionLogout}>Logout</Heading>
                    </TouchableOpacity>
                </Box>
            </View>

        </Box>
    );
}

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    headingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        borderRadius: 50,
    },
    backBtnImg: {
            height: 32,
            width: 32,
        },
        SettingsSection: {
            alignSelf: 'center',
            borderRadius: "20%",
            marginTop: 20,
            width: "95%",
        },
        settingsOption: {
            marginTop: 20,
            paddingBottom: 20,
            paddingLeft: 20,
        },

        settingsBorder:{
            borderBottomWidth: 1,
            borderColor:'#797979',
        },

        settingsOptionLogOut: {
            marginTop: 20,
            paddingBottom: 20,
        },

        settingsOptionText: {
            fontSize: 20,
        },
        settingsOptionLogout: {
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