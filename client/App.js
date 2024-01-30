import { StyleSheet,StatusBar, } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignIn from "./components/authentication/SignIn";
import SignUp from "./components/authentication/SignUp";
import Home from "./components/home/Home";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator   screenOptions={{headerShown: false}} >
        <Stack.Screen
            name="LogIn"
            component={SignIn}/>
          <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{gestureEnabled: false}}/>
          <Stack.Screen
              name="Home"
              component={Home}
              options={{gestureEnabled: false}}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

