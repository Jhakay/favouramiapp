import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, Alert, Platform } from 'react-native';
import { db } from '../utils/firebaseConfig';
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { commonStyles } from '../utils/commonStyles';
import UserContext from '../utils/UserContext';

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
    const { user } = useContext(UserContext);
    const navigation = useNavigation();
    const route = useRoute();
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [eventTime, setEventTime] = useState(new Date());
    const [eventDescription, setEventDescription] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const isEditing = route.params?.eventID; //Determines whether or not it is create new or editing

    useEffect(() => {
        if (isEditing) {
            const loadEventData = async () => {
                const docRef = doc(db, "events", route.params.eventID);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const eventData = docSnap.data();
                    setEventName(eventData.event);
                    setEventDate(eventData.datetime.toDate());
                    setEventTime(eventData.datetime.toDate());
                    setEventDescription(eventData.description);
                    setEventLocation(eventData.location);
                } else {
                    Alert.alert("Error", "Event not found.");
                }
            };
            loadEventData();
        }
    }, [route.params?.eventID]);

    const handleSaveEvent = async () => {
        if (!eventName || !eventDescription || !eventLocation) {
            Alert.alert("Error", "Please fill out all fields.");
            return;
    }
    const fullEventDate = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate(),
        eventTime.getHours(),
        eventTime.getMinutes()
      );
      try {
        if (isEditing) {
          await updateDoc(doc(db, "events", route.params.eventID), {
            event: eventName,
            datetime: fullEventDate,
            description: eventDescription,
            location: eventLocation,
            userID: user.uid,
          });
          Alert.alert("Success", "Event updated successfully!");
        } else {
          await addDoc(collection(db, "events"), {
            event: eventName,
            datetime: fullEventDate,
            description: eventDescription,
            location: eventLocation,
            userID: user.uid,
          });
          Alert.alert("Success", "Event created successfully!");
        }
        navigation.goBack();
      } catch (error) {
        console.error("Error saving event: ", error);
        Alert.alert("Error", "Failed to save the event.");
      }
    };


    const handleCreateEvent = async () => {
        if (!user || !user.uid) {
                Alert.alert("Error", "No user data found. Please log in.");
                return;
            }

            //Combine data and time into one full event date
            const fullEventDate = new Date(
                eventDate.getFullYear(),
                eventDate.getMonth(),
                eventDate.getDate(),
                eventTime.getHours(),
                eventTime.getMinutes()
            );

            try {
                await addDoc(collection(db, "events"), {
                    event: eventName,
                    datetime: fullEventDate,  
                    description: eventDescription,
                    location: eventLocation,
                    userID: user.uid, //UID from user context
                });

                Alert.alert(
                    "Event Added!",
                    "Your event has been successfully created!",
                    [{text: "OK", onPress: () => navigation.navigate('Dashboard')}]
                );

            } catch (error) {
                console.log("Error adding event: ", error);
                Alert.alert("Error", "There was an issue creating your event. Please try again.");
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

            <Text style={styles.heading}>{isEditing ? "Edit Event" : "Create Event"}</Text>

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
                style={commonStyles.input} 
                placeholder="Description"
                onChangeText={setEventDescription}
                value={eventDescription}
            />
            
            <TextInput 
                style={commonStyles.input} 
                placeholder="Location"
                onChangeText={setEventLocation}
                value={eventLocation}
            />

            <TouchableOpacity
                style={commonStyles.button}
                onPress={handleSaveEvent}
            >
                <Text style={commonStyles.buttonText}>{isEditing ? "Update Event" : "Create Event"}</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },

    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    
    container: {
        flex: 1,
        padding: 20,
        alignContent: 'center',
        backgroundColor: '#ADD8E6',
    },

    datePickerContainer: {
        marginBottom: 20,
    },

    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
      },
    
    input: {
        marginBottom: 15,
        paddingHorizontal: 10,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
    },

});

export default CreateEventScreen;
