import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignIn from "./components/authentication/SignIn";
import SignUp from "./components/authentication/SignUp";
import Home from "./components/home/Home";
import Music from "./components/prefrence/Music";
import Movie from "./components/prefrence/Movie";
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

    const handleLogout = async () => {
        setIsAuthenticated(false);
    }
    const handleLogIn = async () => {
        setIsAuthenticated(true);
    }

  return (
    <NavigationContainer>
      <Stack.Navigator  screenOptions={{headerShown: false}} >
          {isAuthenticated ? (
              <Stack.Screen name="Home">
                  {(props) => <Home {...props} handleLogout={handleLogout} />}
              </Stack.Screen>
          ) : (
              <Stack.Screen name="SignIn">
                  {(props) => <SignIn {...props} handleLogIn={handleLogIn} navigation={props.navigation}/>}
              </Stack.Screen>

          )}
          <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{gestureEnabled: false}}/>
          <Stack.Screen name="Music">
              {(props) => <Preference {...props} options={[
                  "Pop", "Rock", "Hip Hop", "Jazz", "Electronic", "Country", "R&B", "Classical", "Reggae", "Blues", "Folk", "Metal", "Lo-fi", "Punk", "Soul", "Indie", "EDM", "Latin", "K-pop", "Gospel", "Reggaeton", "Funk", "House", "Techno", "Alternative", "Trance"
              ]} Next={"Movie"} navigation={props.navigation}/>}
          </Stack.Screen>
          <Stack.Screen name="Movie">
              {(props) => <Preference {...props} options={["Action", "Adventure", "Romance", "Comedy", "Drama", "Horror", "Sci-Fi", "Fantasy", "Thriller", "Documentary", "Biopic", "Musical", "Animation", "Crime", "Mystery", "War", "Western",
                  "Family", "Historical", "Superhero", "Noir", "Indie", "Sport", "Teen", "Epic", "Silent"]} Next={"Movies"} navigation={props.navigation}/>}
          </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

