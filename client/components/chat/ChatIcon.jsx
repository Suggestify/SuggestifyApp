import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Avatar } from 'react-native-elements';

import Music from "../../assets/icons/MusicD.png";
import Book from "../../assets/icons/BooksD.png";
import Movie from "../../assets/icons/MoviesD.png";
import Podcast from "../../assets/icons/PodcastsD.png";
import Games from "../../assets/icons/GamesD.png";
import Shows from "../../assets/icons/ShowsD.png";
import Hobby from "../../assets/icons/HobbiesD.png";

function getImage(medium){
    switch (medium) {
        case "Music":
            return Music;
        case "Books":
            return Book;
        case "Movies":
            return Movie;
        case "Podcasts":
            return Podcast;
        case "Games":
            return Games;
        case "Shows":
            return Shows;
        case "Hobbies":
            return Hobby;
        default:
            return null;
    }
}

function ChatIcon({ medium, initial }) {
    const imageURI = getImage(medium);
    if (imageURI) {
        return (
            <View style={styles.iconContainer}>
                <Image
                    source={imageURI}
                    style={styles.iconStyle}
                    resizeMode="contain"
                />
            </View>
        );
    } else {
        return (
            <View style={styles.iconContainer}>
                <Avatar
                    rounded
                    title={initial.charAt(0).toUpperCase()}
                    overlayContainerStyle={styles.avatarTextContainer}
                    containerStyle={styles.iconStyle}
                    titleStyle={styles.titleStyle}
                />
            </View>
        );
    }
}

export default ChatIcon;

const styles = StyleSheet.create({
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 40,
        overflow: 'hidden',
        backgroundColor: '#525252',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconStyle: {
        width: 32,
        height: 32,
    },
    avatarTextContainer: {
        backgroundColor: '#525252',
    },
    titleStyle: {
        fontSize: 28,
        color: 'white',
    }
});
