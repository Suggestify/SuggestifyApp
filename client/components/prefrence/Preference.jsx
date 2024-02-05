import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';


// Array of arrays containing different options
const allOptions = [
    ["Pop", "Rock", "Hip Hop", "Jazz", "Electronic", "Country", "R&B", "Classical", "Reggae", "Blues", "Folk", "Metal", "Lo-fi", "Punk", "Soul", "Indie", "EDM", "Latin", "K-pop", "Gospel", "Reggaeton", "Funk", "House", "Techno", "Alternative", "Trance"],
    ["Fantasy", "Mystery", "Thriller", "Science Fiction", "Romance", "Historical Fiction", "Biography", "Self-Help", "Young Adult", "Graphic Novel", "Horror", "Poetry", "Crime", "Adventure", "Classics", "Non-Fiction", "Children's", "Humor", "Satire", "Dystopian", "Memoir", "Literary Fiction", "Political", "Philosophy", "Travel", "Nature & Ecology", "Religion & Spirituality"],
    ["Drama", "Comedy", "Thriller", "Sci-Fi", "Fantasy", "Mystery", "Documentary", "Horror", "Reality", "Animation", "Crime", "Historical", "Action", "Musical", "Romance", "Adventure", "Western", "Family", "War", "Legal", "Political", "Sports"],
    ["True Crime", "News", "Comedy", "Science", "Technology", "Health & Wellness", "History", "Business", "Education", "Sports", "Entertainment", "Lifestyle", "Philosophy", "Art", "Music", "Politics", "Religion", "Travel", "Fiction", "Personal Journal", "Games & Hobbies", "Parenting", "Society & Culture", "Science Fiction"],
    ["Action", "Adventure", "Romance", "Comedy", "Drama", "Horror", "Sci-Fi", "Fantasy", "Thriller", "Documentary", "Biopic", "Musical", "Animation", "Crime", "Mystery", "War", "Western", "Family", "Historical", "Superhero", "Noir", "Indie", "Sport", "Teen", "Epic", "Silent"],
    ["Creative Arts", "Outdoor Recreation", "Collecting", "Mind & Body Wellness", "Culinary Arts", "Technology & Gadgets", "Home & Garden", "Literature & Writing", "Performing Arts", "Board Games & Puzzles", "Sports & Fitness", "Travel & Adventure", "Music & Dance", "Photography & Videography", "Crafting", "Animal Care"],
    ["RPG", "FPS", "Puzzle", "Strategy", "Sports", "Racing", "Adventure", "Simulation", "Platformer", "MOBA", "Sandbox", "Fighting", "Stealth", "Survival", "Card & Board", "Educational", "Interactive Fiction", "MMO", "Rhythm", "Visual Novel", "Text-Based", "Tower Defense"]
];

function Preference({navigation}) {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [currentArrayIndex, setCurrentArrayIndex] = useState(0); // Index to track the current array of options
    const [currentOptions, setCurrentOptions] = useState(allOptions[currentArrayIndex]);

    useEffect(() => {
        // Update the options when the current array index changes
        setCurrentOptions(allOptions[currentArrayIndex]);
        // Reset selected options when moving to the next set
        setSelectedOptions([]);
    }, [currentArrayIndex]);

    const handleSelect = (item) => {
        setSelectedOptions(prevSelected => {
            if (prevSelected.includes(item)) {
                return prevSelected.filter(option => option !== item);
            } else {
                return [...prevSelected, item];
            }
        });
    };

    const handleNextOrSkip = () => {

        if (currentArrayIndex < allOptions.length - 1) {
            setCurrentArrayIndex(currentArrayIndex + 1);
        } else {

            navigation.navigate("Home")

        }
    };

    const renderItem = ({ item }) => {
        const isSelected = selectedOptions.includes(item);
        return (
            <TouchableOpacity
                style={[styles.item, isSelected ? styles.itemSelected : null]}
                onPress={() => handleSelect(item)}
            >
                <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={currentOptions}
                renderItem={renderItem}
                keyExtractor={(item) => item}
                numColumns={2}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleNextOrSkip}>
                    <Text style={styles.buttonText}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={handleNextOrSkip}>
                    <Text style={styles.buttonText}>Next ({selectedOptions.length})</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 100,
    },
    item: {
        flex: 1,
        margin: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10
    },
    itemSelected: {
        backgroundColor: '#e9e9e9',
    },
    itemText: {
        textAlign: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },
    button: {
        padding: 15,
        borderRadius: 25,
    },
    nextButton: {
        backgroundColor: 'pink'
    },
    buttonText: {
        color: 'black'
    }
});


export default Preference;
