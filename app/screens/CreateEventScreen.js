import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, Platform } from 'react-native';
import { db } from '../utils/firebaseConfig';
import { collection, addDoc, doc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const formatDate = (date) => {
    const months = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

const formatTime = (time) => {
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;    
};

const CreateEventScreen = () => {

    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [eventTime, setEventTime] = useState(new Date());
    const [eventDescription, setEventDescription] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const navigation = useNavigation();

    const handleCreateEvent = async () => {
 
        try {
            // Get the stringified user data from AsyncStorage
            const storedUserData = await AsyncStorage.getItem('userData');
            if (!storedUserData) {
                throw new Error('No user data found');
            }

            // Parse the stringified user data to get the user object
            const userData = JSON.parse(storedUserData);

            // Check if the user object has a uid property
            if (!userData.uid) {
                throw new Error('User data does not contain UID');
            }

            // Use the uid to create a reference to the user's document in Firestore
            const userDocRef = doc(db, "users", userData.uid);

            //Combine date and time into one full event date
            const fullEventDate = new Date(
                eventDate.getFullYear(),
                eventDate.getMonth(),
                eventDate.getDate(),
                eventTime.getHours(),
                eventTime.getMinutes()
            );
            
            await addDoc(collection(db, "events"), {
                event: eventName,
                datetime: fullEventDate,  
                description: eventDescription,
                location: eventLocation,
                userID: userDocRef,
            });

                Alert.alert(
                    "Event Added!",
                    "Your event has been successfully created!",
                    [
                        {text: "OK", onPress: () => navigation.navigate('Dashboard')}
                    ]
                );

            //Show success message and navigate back to dashboard
        } catch (error) {
            console.log("Error adding event: ", error);
            Alert.alert(
                "Error",
                "There was an issue creating your event. Please try again."
            );
        }
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
        setTimePickerVisibility(false);
      };

    const showTimePicker = () => {
        setTimePickerVisibility(true);
        setDatePickerVisibility(false);
    };

    const onDateChange = (event, selectedDate) => {
       const currentDate = selectedDate || eventDate;
       setDatePickerVisibility(Platform.OS === 'ios');
       setEventDate(currentDate);
       if (Platform.OS === 'android') {
        setTimePickerVisibility(true);
       }
    };

    const onTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || eventTime;
        setTimePickerVisibility(false);
        setEventTime(currentTime);
    };

    return (
        <View style={styles.container}>

            <TextInput 
                style={styles.input} 
                placeholder="Event Name"
                onChangeText={setEventName}
                value={eventName}
            />

            <View style={styles.datePickerContainer}>
                <Button onPress={showDatePicker} title={`Pick Date: ${formatDate(eventDate)}`} />
            </View>
            <View style={styles.datePickerContainer}>
                <Button onPress={showTimePicker} title={`Pick Time: ${formatTime(eventTime)}`} />
            </View>

            {/* Date Picker */}
            {isDatePickerVisible && (
                <DateTimePicker
                value={eventDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onDateChange}
                />
            )}

            {/* Time Picker */}
            {isTimePickerVisible && (
                <DateTimePicker
                value={eventTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onTimeChange}
                is24Hour={true} // Use 24 hour format
                />
            )}

            <TextInput 
                style={styles.input} 
                placeholder="Description"
                onChangeText={setEventDescription}
                value={eventDescription}
            />
            
            <TextInput 
                style={styles.input} 
                placeholder="Location"
                onChangeText={setEventLocation}
                value={eventLocation}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleCreateEvent}
            >
                <Text style={styles.buttonText}>Create Event</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({

    button: {
        backgroundColor: 'blue',
        padding: 15,
    },

    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    
    container: {
        flex: 1,
        padding: 20,
    },

    datePickerContainer: {
        // Style for date picker button
        marginBottom: 20,
    },

    input: {
        height: 40,
        marginBottom: 12,
        borderWidth: 1,
        padding: 10,
    },

});

export default CreateEventScreen;
