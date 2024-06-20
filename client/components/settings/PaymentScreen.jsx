import React, { useEffect, useState } from 'react';
import { View, Button } from 'react-native';
import { CardField, useStripe, StripeProvider } from '@stripe/stripe-react-native';
import axios from 'axios';
import Global from "../../helperFunctions/Global";

function PaymentScreen() {
    const { confirmPayment } = useStripe();
    const [paymentIntent, setPaymentIntent] = useState('');

    useEffect(() => {
        axios.post(`${Global.ip}/settings/payment`, { amount: 99 }) // Amount in cents
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
            billingDetails: {
                name: 'Jane Doe', // Example name, adjust according to your form input if necessary
                email: 'janedoe@example.com', // Similarly, include this if you have it
                // Add other billing details if required by your Stripe setup
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
                postalCodeEnabled={true}  // Enable if you need to collect postal codes
                placeholder={{
                    number: '4242 4242 4242 4242',  // Placeholder card number for guidance
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

// Wrap your PaymentScreen component with StripeProvider at a higher level in your app,
// ideally in the component where you handle routing or main component setup if this
// component is the main part of your app.

export default function PaymentScreenWrapper() {
    return (
        <StripeProvider publishableKey="pk_test_51PTZfjRvKMJ5cw8kk4JqemkCvY0b9ftCnkT0EFTMHf0SghH5drljCUTJKr8KwF0hZdtrajWWi43OIE8EhfjUSSf800O6H2YEMp">
            <PaymentScreen />
        </StripeProvider>
    );
}
