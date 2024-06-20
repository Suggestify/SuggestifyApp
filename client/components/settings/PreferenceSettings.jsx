import React, {useContext} from 'react';

import {View, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {Heading, useToast, Box, Text} from 'native-base';

import {ContactContext} from "../../helperFunctions/ContactContext";
function PreferenceSettings({ navigation }) {
    const {contact, updateContact} = useContext(ContactContext);
    const theme = contact.theme;
    console.log(theme)

    function backToSettings() {
        navigation.navigate('Settings');
    }

    function handleReset(medium) {
        if(medium != "All"){
            Alert.alert(
                "Confirm Reset",
                `Are you sure you want to reset your ${medium} history?`,
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Confirm", onPress: () => resetThread(medium) }
                ]
            );
        }
        else{
            Alert.alert(
                "Confirm Reset",
                `Are you sure you want to reset your ALL chat history?`,
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Confirm", onPress: () => resetAll() }
                ]
            );
        }
    }

    async function resetThread(medium) {
        navigation.navigate('NewPreference', {medium: medium});
    }

    async function resetAll() {
        navigation.navigate('Preference');
    }


    return (
        <Box style={styles.container} bg={theme ? `black` : `light.200`}>

            <Box style={styles.containerHeader} bg={theme ? `trueGray.900` : `white`}>
                <TouchableOpacity onPress={backToSettings} >
                    <Heading fontSize={"md"} style={styles.backBtnText}>&lt;</Heading>
                </TouchableOpacity>
                <Heading  size="md" fontSize={50} bold color={theme ? `trueGray.300` : `trueGray.600`}>
                    Settings
                </Heading>
            </Box>
            <Box style = {styles.headingBackground} bg={theme ? `trueGray.900` : `white`}>
                <Text style = {styles.headingStyle} color={theme ? `trueGray.300` : `darkText`}>Click on an option to reset chat history</Text>
            </Box>
            <Box style={styles.SettingsSection} bg={theme ? `trueGray.900` : `white`}>
                <TouchableOpacity style={[styles.settingsOption, styles.settingsBorder]} onPress={() =>handleReset("Music")}>
                    <Text  color={theme ? `trueGray.300` : `darkText`} style={styles.settingsOptionText}>Music</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingsOption, styles.settingsBorder]} onPress={() =>handleReset("Book")}>
                    <Text  color={theme ? `trueGray.300` : `darkText`} style={styles.settingsOptionText}>Book</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingsOption, styles.settingsBorder]} onPress={() =>handleReset("Podcast")}>
                    <Text  color={theme ? `trueGray.300` : `darkText`} style={styles.settingsOptionText}>Podcast</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingsOption, styles.settingsBorder]} onPress={() =>handleReset("Show")}>
                    <Text  color={theme ? `trueGray.300` : `darkText`} style={styles.settingsOptionText}>Show</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingsOption, styles.settingsBorder]} onPress={() =>handleReset("Movie")}>
                    <Text  color={theme ? `trueGray.300` : `darkText`} style={styles.settingsOptionText}>Movie</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingsOption, styles.settingsBorder]} onPress={() =>handleReset("Hobby")}>
                    <Text  color={theme ? `trueGray.300` : `darkText`} style={styles.settingsOptionText}>Hobby</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsOption} onPress={() =>handleReset("Game")}>
                    <Text  color={theme ? `trueGray.300` : `darkText`} style={styles.settingsOptionText}>Game</Text>
                </TouchableOpacity>
            </Box>
            <View style={styles.logOutContainer} >
            <Box bg={theme ? `trueGray.900` : `white`} style={styles.SettingsSection}>
                <TouchableOpacity  style={styles.settingsOptionLogOut} onPress={() =>handleReset("All")}>
                    <Heading color={theme ? `trueGray.300` : `darkText`} style={styles.settingsOptionLogout}>Reset All Chats</Heading>
                </TouchableOpacity>
            </Box>
            </View>


        </Box>
    );
}


export default PreferenceSettings;
const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        containerHeader: {
            flexDirection: 'row',  // Ensures horizontal layout
            justifyContent: 'center', // Centers content horizontally
            alignItems: 'center', // Centers content vertically
            paddingTop: 60,
            paddingBottom: 20,
            marginBottom: 20,

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
        backBtn: {
            display: "flex",
            color: "white",
            borderRadius: 50,
        },
        backBtnText: {
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            paddingLeft: 10,
            paddingRight: 10,
        },
        SettingsSection: {
            alignSelf: 'center',
            marginTop: 20,
            borderRadius: "20%",
            width: "95%",
        },
        settingsOption: {
            marginTop: 20,
            paddingBottom: 20,
            paddingLeft: 20,

        },

        settingsBorder:{
            borderBottomWidth: 1,
            borderColor:'#797979',
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
            borderColor:'#797979',
            borderBottomWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between', // Aligns items on opposite ends
            alignItems: 'center' // Aligns items vertically
        },
            logOutContainer: {
                flex: 1,
                justifyContent: 'flex-end',
                marginBottom: 36,
        }

    }
)