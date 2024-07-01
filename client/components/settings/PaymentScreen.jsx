import React, { useEffect, useState, useContext } from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import { useStripe} from '@stripe/stripe-react-native';
import { ContactContext } from "../../helperFunctions/ContactContext";
import api from "../../helperFunctions/Api";
import {Box, Heading, Text} from "native-base";



function PaymentScreen({navigation}) {
    const { contact, updateContact } = useContext(ContactContext);
    const theme = contact.theme;
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [paymentIntent, setPaymentIntent] = useState('');

    useEffect(() => {
        async function fetchData() {
            const response = await api.post(`/settings/paymentIntents`, { amount: 99, userName: contact.userName });
            if(response.status === 200){
                setPaymentIntent(response.data.clientSecret);
            } else {
                console.error("Error creating payment intent:");
            }
        }
        fetchData();
    }, []);

    const handlePayment = async () => {
        if (!paymentIntent) {
            console.log('No payment intent available.');
            return;  // Early return if there's no payment intent available
        }
        console.log('Initializing payment sheet...');
        const initResponse = await initPaymentSheet({
            merchantDisplayName: 'Your Merchant Name',
            paymentIntentClientSecret: paymentIntent,
            returnURL: 'suggestify://Home',
        });

        if (initResponse.error) {
            console.error(`Initialization error: ${initResponse.error.message}`);
            alert(`Error code: ${initResponse.error.code}`);
            return;
        }

        console.log('Presenting payment sheet...');
        const presentResponse = await presentPaymentSheet();
        if (presentResponse.error) {
            console.error(`Presentation error: ${presentResponse.error.message}`);
            alert(`Error: ${presentResponse.error.message}`);
        } else {
            console.log('Payment successful!');
        }
    };

    function backToSettings() {
        navigation.navigate('Settings');
    }

    return (
        <Box style={styles.container} bg={theme ? 'black' : 'light.200'}>
            <Box style={styles.containerHeader} bg={theme ? 'trueGray.900' : 'white'}>
                <TouchableOpacity onPress={backToSettings} style={styles.backBtn}>
                    <Image
                        source={theme ? require('../../assets/icons/previousD.png') : require('../../assets/icons/previousL.png')}
                        style={styles.backBtnImg}
                    />
                </TouchableOpacity>
                <View style={styles.headingContainer}>
                    <Heading size="md" fontSize={40} bold color={theme ? 'trueGray.300' : 'trueGray.600'}>
                        Premium
                    </Heading>
                </View>
            </Box>
            <Box style={styles.headingBackground} bg={theme ? `trueGray.900` : `white`}>
                <Text style={styles.headingStyle} color={theme ? `trueGray.300` : `darkText`}>Upgrade to Premium for 30
                    Daily Messages
                </Text>
            </Box>
                <View style={styles.logOutContainer}>
                    <Box bg={theme ? `trueGray.900` : `white`} style={styles.SettingsSection}>
                        <TouchableOpacity style={styles.settingsOptionLogOut} onPress={() => handlePayment()}>
                            <Heading color={theme ? `trueGray.300` : `darkText`} style={styles.settingsOptionLogout}>Confirm
                                Payment</Heading>
                        </TouchableOpacity>
                    </Box>
                    <Text style={styles.footer} color={theme ? `trueGray.500` : `darkText`}>Please Note This is a non-Refundable Purchase</Text>
                </View>

        </Box>
    )};

export default PaymentScreen;


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
    headingBackground: {
        alignSelf: 'center',
        width: "95%",
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: "20%",
    },
    headingStyle: {
        fontSize: 15,
    },

    SettingsSection: {
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: "20%",
        width: "95%",
    },
    settingsOption: {
        paddingBottom: 20,
        paddingHorizontal: 20,

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
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between', // Aligns items on opposite ends
        alignItems: 'center' // Aligns items vertically
    },
    logOutContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 36,
        alignItems: 'center',
    },
    input: {
        fontSize: 18,
        marginTop: 20,

    },
    flex: {
        flex: 1,
    },
    footer: {
        paddingTop: 20,
        fontSize: 15,
    },
    totalBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingHorizontal: 20,
        marginBottom: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#797979',

    },
    total: {
        paddingVertical: 20,
        fontSize: 20,
    },

})