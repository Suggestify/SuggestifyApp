
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const options = ["Drama", "Comedy", "Thriller", "Sci-Fi", "Fantasy", "Mystery", "Documentary", "Horror", "Reality", "Animation", "Crime", "Historical", "Action", "Musical", "Romance", "Adventure", "Western", "Family", "War", "Legal", "Political", "Sports"];
function Music(props) {
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleSelect = (item) => {
        setSelectedOptions(prevSelected => {
            if (prevSelected.includes(item)) {
                return prevSelected.filter(option => option !== item);
            } else {
                return [...prevSelected, item];
            }
        });
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
                data={options}
                renderItem={renderItem}
                keyExtractor={(item) => item}
                numColumns={2}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.nextButton]}>
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

export default Music;

