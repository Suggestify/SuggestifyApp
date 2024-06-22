
import React, {useEffect, useState, useContext} from 'react';
import {View, TouchableOpacity, Image, TextInput, Alert, StyleSheet} from 'react-native';
import {StripeProvider, useStripe} from '@stripe/stripe-react-native';
import axios from 'axios';
import Global from "../../helperFunctions/Global";
import {STRIPE_KEY} from '@env';
import {Box, Heading, Text, Input} from "native-base";
import {ContactContext} from "../../helperFunctions/ContactContext";
import { useNavigation } from '@react-navigation/native';



function PaymentScreen() {
    const navigation = useNavigation();
    const {contact, setContact} = useContext(ContactContext);
    const {createToken} = useStripe();
    const [cardNumber, setCardNumber] = useState('');
    const [expDate, setExpDate] = useState('');
    const [cvc, setCvc] = useState('');
    const theme = contact.theme;

    function backToSettings() {
        navigation.navigate('Settings');
    }




    useEffect(() => {
        axios.post(`${Global.ip}/settings/payment`, { amount: 99, userName: contact.userName }) // Amount in cents

            .then(response => {
                console.log('Payment intent created:', response.data);
            })
            .catch(error => {
                console.error("Error creating payment intent:", error);
            });
    }, []);

    const handleExpDateChange = (text) => {
        // Allow numeric input only and auto-format if needed
        const processedText = text.replace(/[^0-9]/g, '').slice(0, 4); // Restrict input to 4 digits (MMYY)
        setExpDate(processedText);
    };

    const handlePayment = async () => {
        const expMonth = expDate.slice(0, 2);
        const expYear = `20${expDate.slice(2, 4)}`;

        const {token, error} = await createToken({
            card: {
                number: cardNumber,
                expMonth: parseInt(expMonth, 10),
                expYear: parseInt(expYear, 10),
                cvc,
            },
        });

        if (error) {
            Alert.alert('Payment Error', error.message);
        } else {
            Alert.alert('Payment Successful', `Token: ${token.id}`);
            // Implement further payment processing logic here if needed
        }
    };

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
                    Daily Messages</Text>
            </Box>
            <Box style={styles.SettingsSection} bg={theme ? `trueGray.900` : `white`}>
                <Box style={styles.settingsOption}>
                    <Input
                        color={theme ? `trueGray.300` : `darkText`}
                        style={styles.input}
                        variant="underlined"
                        placeholder="Card Holder Name"
                    />
                    <Input
                        color={theme ? `trueGray.300` : `darkText`}
                        style={styles.input}
                        variant="underlined"
                        onChangeText={setCardNumber}
                        value={cardNumber}
                        placeholder="Card Number"
                        keyboardType="numeric"
                    />
                    <Input
                        color={theme ? `trueGray.300` : `darkText`}
                        style={styles.input}
                        variant="underlined"
                        onChangeText={handleExpDateChange}
                        value={expDate}
                        placeholder="MMYY"
                        keyboardType="numeric"
                        maxLength={4}
                    />
                    <Input
                        color={theme ? `trueGray.300` : `darkText`}
                        style={styles.input}
                        variant="underlined"
                        onChangeText={setCvc}
                        value={cvc}
                        placeholder="CVC"
                        keyboardType="numeric"
                        maxLength={3}
                    />
                </Box>
                <Box style={styles.totalBox}>
                    <Text style={styles.total} color={theme ? `trueGray.300` : `darkText`}>Total:</Text>
                    <Text  style={styles.total} color={theme ? `trueGray.300` : `darkText`}>$3.99 USD</Text>
                </Box>
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
    );
}

export default function PaymentScreenWrapper() {
    return (
        <StripeProvider publishableKey={STRIPE_KEY}>
            <PaymentScreen/>
        </StripeProvider>
    );
}

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