import React, {useEffect, useContext} from 'react';

import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {Heading, Box, Text} from 'native-base';
import axios from "axios";
import {ContactContext} from "../../helperFunctions/ContactContext";
import Global from "../../helperFunctions/Global";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Verify({route, navigation}) {
    const {contact, updateContact} = useContext(ContactContext);
    const userName = route.params.userName;

    useEffect(() => {
        async function checkVerification() {
            console.log("checking verification");
            try {
                const response = await axios.get(`${Global.ip}/verification/verified`, {
                    params: {
                        userName: userName
                    }
                });
                if (response.status === 200) {
                    console.log("verified");
                    const accessToken = response.data.access;
                    const refreshToken = response.data.refresh;
                    const userName = response.data.userName;

                    await AsyncStorage.setItem('accessToken', accessToken);
                    await AsyncStorage.setItem('refreshToken', refreshToken);
                    await AsyncStorage.setItem('userName', userName);
                    updateContact({userName: userName});
                    updateContact({theme: true});
                    updateContact({notificationsOn: false});
                    updateContact({mediumOrder: ['Music', 'Books', 'Podcasts', 'Shows', 'Movies', 'Hobbies', 'Games']});

                    await AsyncStorage.removeItem('verification');
                    await AsyncStorage.removeItem('tempUserName');
                    navigation.navigate('Preference');
                } else if (response.status === 400) {
                    await AsyncStorage.removeItem('verification');
                    await AsyncStorage.removeItem('tempUserName');
                    navigation.navigate('SignIn');
                } else {
                    setTimeout(checkVerification, 4000);  // Retry after 5 seconds
                }
            } catch (error) {
                setTimeout(checkVerification, 4000);  // Retry after 5 seconds in case of error
            }
        }

        checkVerification();
    }, [userName]);

    async function backToHome() {
        const response = await axios.delete(`${Global.ip}/verification/cancel`, {
            params: {
                userName: userName
            }
        })
        if (response.status === 200) {
            await AsyncStorage.removeItem('tempUserName');
            await AsyncStorage.removeItem('verification');
            navigation.navigate('SignIn');
        }
    }

    return (
        <Box style={styles.container} bg={`black`}>
            <Box style={styles.containerHeader} bg={'trueGray.900'}>
                <View style={styles.headingContainer}>
                    <Heading size="md" fontSize={50} bold color={'trueGray.300'}>
                        Verification
                    </Heading>
                </View>
            </Box>
            <View style={styles.center}>
                <View style={styles.emailContainer}>
                    <Image
                        source={require('../../assets/icons/mail.png')}
                        style={styles.email}
                    />
                    <Text color={'trueGray.300'} style={{ fontSize: 20, marginTop: 20, textAlign: 'center'}}>Please check your email for a verification link</Text>
                    <Text color={'trueGray.300'} style={{ fontSize: 15 , marginTop: 10, textAlign: 'center'}}>this link will expire in 5 minutes</Text>
                </View>
            </View>
            <View style={styles.logOutContainer} >
                <Box style={styles.SettingsSection} bg={ `trueGray.900`}>
                    <TouchableOpacity onPress={backToHome} style={styles.settingsOptionLogOut}>
                        <Heading color={ `trueGray.300`} style={styles.settingsOptionLogout}>Cancel</Heading>
                    </TouchableOpacity>
                </Box>
            </View>
        </Box>
    );
}

export default Verify;

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
        center: {
            flex: 1,
            alignItems: 'center',
            textAlign: 'center',
        },
        emailContainer: {
            width: '75%',
            alignItems: 'center',
            textAlign: 'center',
        },
        email: {
            marginTop: '45%',
            width: 100,
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
            width: "75%",
        },
        settingsOption: {
            marginTop: 20,
            paddingBottom: 20,
            paddingLeft: 20,
        },

        settingsBorder: {
            borderBottomWidth: 1,
            borderColor: '#797979',
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
            borderColor: '#797979',
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