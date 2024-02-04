import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignIn from "./components/authentication/SignIn";
import SignUp from "./components/authentication/SignUp";
import Home from "./components/home/Home";
import Preference from "./components/prefrence/Preference";
import React, {useState, useEffect} from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('accessToken');
            setIsAuthenticated(!!token);
        };
        checkToken();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                {isAuthenticated ? (
                    <Stack.Screen name="Home">
                        {(props) => <Home {...props} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
                    </Stack.Screen>
                ) : (
                    <Stack.Screen name="SignIn">
                        {(props) => <SignIn {...props} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} navigation={props.navigation}/>}
                    </Stack.Screen>

                )}
                <Stack.Screen
                    name="SignUp"
                    component={SignUp}
                    options={{gestureEnabled: false}}
                />
                <Stack.Screen name="Preference">
                    {(props) => <Preference {...props} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
