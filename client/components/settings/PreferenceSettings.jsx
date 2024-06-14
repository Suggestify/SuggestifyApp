import React, {useContext} from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {Heading} from "native-base";
import {ContactContext} from "../../ContactContext";
function PreferenceSettings({ navigation }) {
    const {contact, updateContact} = useContext(ContactContext);
    const userName = contact.userName;

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
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <TouchableOpacity onPress={backToSettings} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>&lt;</Text>
                </TouchableOpacity>
                <Heading style={styles.header} size="md" fontSize={50} bold color={"white"}>
                    Settings
                </Heading>
            </View>
            <View style = {styles.headingBackground}>
                <Text style = {styles.headingStyle}>Click on an option to reset chat history</Text>
            </View>
            <View style={styles.SettingsSection}>
                <TouchableOpacity style={[styles.settingsOption, styles.settingsBorder]} onPress={() =>handleReset("Music")}>
                    <Text style={styles.settingsOptionText}>Music</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingsOption, styles.settingsBorder]} onPress={() =>handleReset("Book")}>
                    <Text style={styles.settingsOptionText}>Book</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingsOption, styles.settingsBorder]} onPress={() =>handleReset("Podcast")}>
                    <Text style={styles.settingsOptionText}>Podcast</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingsOption, styles.settingsBorder]} onPress={() =>handleReset("Show")}>
                    <Text style={styles.settingsOptionText}>Show</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingsOption, styles.settingsBorder]} onPress={() =>handleReset("Movie")}>
                    <Text style={styles.settingsOptionText}>Movie</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingsOption, styles.settingsBorder]} onPress={() =>handleReset("Hobby")}>
                    <Text style={styles.settingsOptionText}>Hobby</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsOption} onPress={() =>handleReset("Game")}>
                    <Text style={styles.settingsOptionText}>Game</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.SettingsSection}>
                <TouchableOpacity style={styles.settingsOptionLogOut}  onPress={() =>handleReset("All")}>
                    <Text style={styles.settingsOptionLogout}>Reset All Chats</Text>
                </TouchableOpacity>
            </View>


        </View>
    );
}


export default PreferenceSettings;
const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#000000',
        },
        containerHeader: {
            flexDirection: 'row',  // Ensures horizontal layout
            justifyContent: 'center', // Centers content horizontally
            alignItems: 'center', // Centers content vertically
            paddingTop: 60,
            paddingBottom: 20,
            marginBottom: 20,
            backgroundColor: '#1f1f1f',
        },
        headingBackground: {
            alignSelf: 'center',
            backgroundColor: '#1f1f1f',
            width: "95%",
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: "20%",
        },
        headingStyle: {
            color: "white",
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
            backgroundColor: '#1f1f1f',
            borderRadius: "20%",
            width: "95%",
        },
        settingsOption: {
            marginTop: 20,
            paddingBottom: 20,
            paddingLeft: 20,
            borderStyle: "solid",
            borderColor:'#797979',
        },

        settingsBorder:{
            borderBottomWidth: 1,
            borderColor:'#797979',
        },

        settingsOptionLogOut: {
            marginTop: 20,
            paddingBottom: 20,
            borderStyle: "solid",
            borderColor:'#797979',
        },

        settingsOptionText: {
            color: '#afafaf',
            fontSize: 20,
        },
        settingsOptionLogout: {
            color: '#afafaf',
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
            width: "100%",
        }

    }
)