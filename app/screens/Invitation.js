import React, { useState, useEffect } from 'react';
import { Dimensions, ImageBackground, View, Text, Image, StyleSheet, Alert } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';
import formatDateAndTime from '../utils/formatDateAndTime';
import invitationbackground from '../assets/invitationbackground.jpg'; 

const Invitation = ({ route }) => {
  const { eventID} = route.params;
  const [eventDetails, setEventDetails] = useState(null);

  useEffect(() => {
    console.log("Event Details: ", {eventDetails});
    const fetchEventDetails = async () => {
      const eventRef = doc(db, 'events', eventID);
      try {
        const docSnap = await getDoc(eventRef);
        if (docSnap.exists()) {
          let eventData = docSnap.data();

          // Check if the eventData has a datetime field and it's an object
          if (eventData.datetime && typeof eventData.datetime.seconds === 'number') {
            // Convert the Firestore Timestamp to a JavaScript Date object
            const dateObj = new Date(eventData.datetime.seconds * 1000);

            // Format the date and time using formatDateAndTime utility
            const { formattedDate, formattedTime } = formatDateAndTime(dateObj);

            // Include the formatted date and time in the eventData object
            eventData = {
              ...eventData,
              date: formattedDate, // Assuming your component uses 'date' and 'time' fields
              time: formattedTime
            };

        } else {
          // Handle the case where eventData.datetime is not in the expected format
          eventData.date = 'Date unavailable';
          eventData.time = 'Time unavailable';
        }
        setEventDetails(eventData);
      } else {
        Alert.alert('Event not found', 'No details available for this event.');
      }
      } catch (error) {
        Alert.alert('Error', 'There was a problem fetching event details.');
        console.error('Error fetching event details: ', error);
      }
    };
    fetchEventDetails();
  }, [eventID]); 

  if (!eventDetails) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Extract Event Details
  const { eventName, date, time, description, location } = eventDetails;

  return (
    <ImageBackground
     source={invitationbackground} style={styles.backgroundImage}
    >
      <View style={styles.invitationTextContainer}>
        <Text style={styles.greeting}>Hello!</Text>
        <Text style={styles.celebrateText}>We are having a celebration!</Text>
        <Text style={styles.event}>Come to {eventDetails.event}</Text>
        <Text style={styles.description}>{eventDetails.description}</Text>
        <Text style={styles.date}>on {eventDetails.date},</Text>
        <Text style={styles.time}>at {eventDetails.time}</Text>
        <Text style={styles.location}>Location: {eventDetails.location}</Text>
        <Text style={styles.RSVP}>RSVP below</Text>
        
    </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  
  celebrateText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 8,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  date: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
  },
  
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
  },

  event: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
  },

  greeting: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 8,
    fontWeight: 'bold',
  },

  invitationTextContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)', 
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  
  location: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
  },

  RSVP: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
  },

  time: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
  },
  
});

export default Invitation;
