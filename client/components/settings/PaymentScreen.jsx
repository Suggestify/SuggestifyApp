import React, { useEffect, useState, useContext } from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { ContactContext } from "../../helperFunctions/ContactContext";
import api from "../../helperFunctions/Api";


function PaymentScreen() {
    const { contact, updateContact } = useContext(ContactContext);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [paymentIntent, setPaymentIntent] = useState('');

    useEffect(async () => {
       const response = await api.post(`/settings/paymentIntents`, { amount: 99, userName: contact.userName }) // Amount in cents
        if(response.status === 200){
                setPaymentIntent(response.data.clientSecret);
        }else {
                console.error("Error creating payment intent:");
            }
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



    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={handlePayment}>
                    <Text>text</Text>
                </TouchableOpacity>
        </View>
    );
}

export default PaymentScreen;
