import React, {useState, useContext} from 'react';
import {Text, TouchableOpacity, Image, StyleSheet, View, ScrollView} from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import ChatPreview from "./ChatPreview";
import { ContactContext } from "../../ContactContext";
import axios from "axios";
import Global from "../Global";

function Home({navigation}) {

    const { contact, updateContact } = useContext(ContactContext);
    const userName = contact.userName
    const order = contact.mediumOrder;
    const initialArray = [
        { medium: "Music", color: "#593232", image: require('../../assets/icons/Music.png') },
        { medium: "Books", color: "#204823", image: require('../../assets/icons/Books.png') },
        { medium: "Podcasts", color: "#6b6831", image: require('../../assets/icons/Podcasts.png') },
        { medium: "Shows", color: "#273052", image: require('../../assets/icons/Shows.png') },
        { medium: "Movies", color: "#6b412a", image: require('../../assets/icons/Movies.png') },
        { medium: "Hobbies", color: "#4c2756", image: require('../../assets/icons/Hobbies.png') },
        { medium: "Games", color: "#204949", image: require('../../assets/icons/Games.png') }
    ];

    const [myArray, setMyArray] = useState(reorderArray(initialArray, order));


    function reorderArray(arr, order) {
        const newArr = [];
        order.forEach(o => {
            const found = arr.find(item => item.medium === o);
            if (found) {
                newArr.push(found);
            }
        });
        return newArr;
    }
    function moveToFrontAndShift(arr, index) {
        if (index < 0 || index >= arr.length) {
            return; // Invalid index
        }
        const [item] = arr.splice(index, 1); // Remove the item from the array
        arr.unshift(item); // Add it to the front of the array
    }
    async function onSubmit() {
        navigation.navigate('Settings');
    }

    async function handleClick(index) {
        const medium = myArray[index].medium;
        moveToFrontAndShift(myArray, index);
        await axios.put(`${Global.ip}/settings/updateOrder`, {
            userName: userName,
            newOrder: myArray.map(item => item.medium)
        })
        setMyArray([...myArray]);
        navigation.navigate('LoadingHome', {medium: medium});
    }

    return (
        <LinearGradient colors={['#000000', '#3f3f3f']} style={styles.linearGradient}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Suggestify</Text>
                    <TouchableOpacity onPress={onSubmit}>
                        <Image
                            source={require('../../assets/icons/profile.png')}
                            style={styles.imageStyle} // You can define styles for your image in your stylesheet
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.container2}>
                    {myArray.map((item, index) => (
                        <TouchableOpacity key={item.medium} onPress={() => handleClick(index)} style={styles.chatPreview}>
                            <ChatPreview medium={item.medium} color={item.color} image={item.image}/>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

export default Home;

const styles = StyleSheet.create({
    header: {
        width: '85%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 30
    },
    headerText: {
        color: '#adadad',
        fontSize: 40,
    },
    linearGradient: {
        flex: 1, // This ensures the gradient fills the screen
    },
    scrollViewContainer: {
        paddingTop: 100,
        flexGrow: 1,
        alignItems: 'center',

        backgroundColor: '#151515',
    },

    imageStyle: {
        width: 50,
        height: 50,
    },
    container2:{
        width: '100%',
        alignItems: 'center',
        justifyContent: "center"

    },
    chatPreview:{
        paddingBottom: 8
    }
});
