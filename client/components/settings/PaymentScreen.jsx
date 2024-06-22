import React, { useEffect, useState, useContext } from 'react';
import { View, Button } from 'react-native';
import { CardField, useStripe, StripeProvider } from '@stripe/stripe-react-native';
import axios from 'axios';
import Global from "../../helperFunctions/Global";
import { ContactContext } from "../../helperFunctions/ContactContext";
import { STRIPE_KEY } from '@env';


function PaymentScreen() {
    const { contact, updateContact } = useContext(ContactContext);
    const { confirmPayment } = useStripe();
    const [paymentIntent, setPaymentIntent] = useState('');

    useEffect(() => {
        axios.post(`${Global.ip}/settings/payment`, { amount: 99, userName: contact.userName }) // Amount in cents
            .then(response => {
                setPaymentIntent(response.data.clientSecret);
            })
            .catch(error => {
                console.error("Error creating payment intent:", error);
            });
    }, []);

    const handlePayment = async () => {
        if (!paymentIntent) return;  // Early return if there's no payment intent available

        const { error } = await confirmPayment(paymentIntent, {
            type: 'Card',  // Explicitly specify the payment method type
            paymentMethodType: 'Card',  // Explicitly specify the payment method type
            // might not be needed
            billingDetails: {
                name: 'Jane Doe',
                email: 'janedoe@example.com',
            },
        });

        if (error) {
            alert(`Payment Confirmation Error: ${error.message}`);
        } else {
            alert('Payment Successful');
        }
    };


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <CardField
                postalCodeEnabled={true}
                placeholder={{
                    number: '4242 4242 4242 4242',
                }}
                cardStyle={{
                    backgroundColor: '#FFFFFF',
                    textColor: '#000000',
                }}
                style={{
                    width: '100%',
                    height: 50,
                    marginVertical: 30,
                }}
                onCardChange={(cardDetails) => {
                    console.log('Card details: ', cardDetails);
                }}
            />

            <Button onPress={handlePayment} title="Pay" />
        </View>
    );
}

export default function PaymentScreenWrapper() {
    return (
        <StripeProvider publishableKey={STRIPE_KEY}>
            <PaymentScreen />
        </StripeProvider>
    );
}
