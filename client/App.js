import React from 'react'
import Toast from 'react-native-toast-message';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeBaseProvider} from 'native-base';

import SignIn from "./components/authentication/SignIn";
import SignUp from "./components/authentication/SignUp";
import Home from "./components/home/Home";
import Preference from "./components/preference/Preference";
import Settings from "./components/settings/Settings";
import PreferenceSettings from "./components/settings/PreferenceSettings";
import NewPreference from "./components/preference/NewPreference";
import ChatScreen from "./components/chat/ChatScreen";
import ChatPreview from "./components/home/ChatPreview";
import LoadingHome from "./components/loading/LoadingHome";
import LoadingLaunch from "./components/loading/LoadingLaunch";

import {ContactProvider} from './ContactContext';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NativeBaseProvider>
            <ContactProvider>
                <NavigationContainer>
                    <Stack.Navigator screenOptions={{headerShown: false}}>
                        <Stack.Screen name="loadingLaunch" component={LoadingLaunch}/>
                        <Stack.Screen name="SignIn" component={SignIn}/>
                        <Stack.Screen name="Home" component={Home}/>
                        <Stack.Screen name="SignUp" component={SignUp}/>
                        <Stack.Screen name="Preference" component={Preference}/>
                        <Stack.Screen name="NewPreference" component={NewPreference}/>
                        <Stack.Screen name="ChatPreview" component={ChatPreview}/>
                        <Stack.Screen name="LoadingHome" component={LoadingHome}/>
                        <Stack.Screen name="ChatScreen" component={ChatScreen}/>
                        <Stack.Screen name="Settings" component={Settings}/>
                        <Stack.Screen name="PreferenceSettings" component={PreferenceSettings}/>
                    </Stack.Navigator>
                </NavigationContainer>
                <Toast/>
            </ContactProvider>
        </NativeBaseProvider>
    );
}
