import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignIn from "./components/authentication/SignIn";
import SignUp from "./components/authentication/SignUp";
import Home from "./components/home/Home";
import Preference from "./components/prefrence/Preference";
import React from 'react'

import Loading from "./components/Loading";
import ChatScreen from "./components/chat/ChatScreen";

const Stack = createNativeStackNavigator();

export default function App() {

    return (

           /* <NavigationContainer>
                <Stack.Navigator screenOptions={{headerShown: false}}>
                    <Stack.Screen name="Loading" component={Loading} />
                    <Stack.Screen name="SignIn" component={SignIn} />
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="SignUp" component={SignUp}/>
                    <Stack.Screen name="Preference" component={Preference}/>
                </Stack.Navigator>
            </NavigationContainer>

            */

        <ChatScreen/>

    );
}
