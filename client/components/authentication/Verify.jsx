import React, { useEffect, useContext} from 'react';

import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {Heading, Box, Text} from 'native-base';
import axios from "axios";
import {ContactContext} from "../../helperFunctions/ContactContext";
import Global from "../../helperFunctions/Global";
import AsyncStorage from "@react-native-async-storage/async-storage";
function Verify({route, navigation}) {
    const { contact, updateContact } = useContext(ContactContext);
    const userName = route.params.userName;

    useEffect(() => {
        async function checkVerification() {
            console.log("checking verification");
            try {
                const response = await axios.get(`${Global.ip}/auth/verified`, {
                    params: {
                        userName: userName
                    }});
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
                }

                else {
                    setTimeout(checkVerification, 4000);  // Retry after 5 seconds
                }
            } catch (error) {
                setTimeout(checkVerification, 4000);  // Retry after 5 seconds in case of error
            }
        }

        checkVerification();
        },[userName]);

    async function backToHome() {
        const response  = await axios.delete(`${Global.ip}/auth/cancel`, {
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
        <Box style={styles.container} bg={ `black`}>
            <Box style={styles.containerHeader} bg={'trueGray.900' }>
                <TouchableOpacity onPress={backToHome} style={styles.backBtn}>
                    <Image
                        source={ require('../../assets/icons/previousD.png')}
                        style={styles.backBtnImg}
                    />
                </TouchableOpacity>
                <View style={styles.headingContainer}>
                    <Heading size="md" fontSize={50} bold color={'trueGray.300' }>
                        Verification
                    </Heading>
                </View>
            </Box>
            <Text> Please Verify your email to continue </Text>
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