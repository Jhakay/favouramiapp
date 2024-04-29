import React, { useState, useEffect } from 'react';
import { Dimensions, ImageBackground, View, Text, Image, StyleSheet, Alert, Button, TouchableOpacity } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';
import formatDateAndTime from '../utils/formatDateAndTime';
import invitationbackground from '../assets/invitationbackground.jpg'; 
import { commonStyles } from '../utils/commonStyles';

const Invitation = ({ route, navigation }) => {
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

  const handleSendInvitation = () => {
    //Create logic to send email invitations to guests
    Alert.alert(
      'Feature Coming Soon', 
      'Sending email invitations to your guests will be available soon.',
    [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ],
    {cancelable: false}
  );
  };

  const handleCancel = () => {
    navigation.goBack(); 
  };

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
        <Text style={styles.event}>{eventDetails.event}</Text>
        <Text style={styles.description}>{eventDetails.description}</Text>
        <Text style={styles.date}>on {eventDetails.date},</Text>
        <Text style={styles.time}>at {eventDetails.time}</Text>
        <Text style={styles.location}>Location: {eventDetails.location}</Text>
        <Text style={styles.RSVP}>RSVP below</Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={
            handleSendInvitation
          }
        >
          <Text
          style={styles.buttonText}
          >
            Send Invitations</Text>
        </TouchableOpacity>


        <Text
          style={commonStyles.hLinkText}
          onPress={handleCancel}
          >
            Cancel
        </Text>
        
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

  button: {
    backgroundColor: '#efc363',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    marginBottom:10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#353839',
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  celebrateText: {
    fontSize: 18,
    fontWeight: '700',
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
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 8,
  },

  greeting: {
    fontSize: 30,
    textAlign: 'center',
    marginVertical: 8,
    fontWeight: '900',
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
    fontWeight: '800',
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
