import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs, getDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import formatDateAndTime from '../utils/formatDateAndTime';


const EventScreen = ({ route, navigation }) => {
  const { eventID, userId } = route.params; 
  const [eventDetails, setEventDetails] = useState(null);
  const [guests, setGuests] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

    // Fetch the details of the event
    const fetchEventDetails = async () => {
      try {
        const eventRef = doc(db, 'events', eventID);
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
          let eventData = eventSnap.data();

          // Log to see what eventData contains
          console.log("Fetched event data: ", eventData);

          if (eventData.datetime && typeof eventData.datetime.seconds === 'number') {
            // Convert the Timestamp to a JavaScript Date object
            const dateObj = new Date(eventData.datetime.seconds * 1000);
            
            // Now, use formatDateAndTime utility function
            const { formattedDate, formattedTime } = formatDateAndTime(dateObj);
    
            // Include the formatted date and time in your state
            eventData.formattedDate = formattedDate;
            eventData.formattedTime = formattedTime;
          } else {
            //Handle invalid date object
            eventData.formattedDate = 'Invalid Date';
            eventData.formattedTime = 'Invalid Time';
          }
          setEventDetails(eventData);
        } else {
          Alert.alert("Event not found", "The event details could not be found.");
        }
      } catch (error) {
        Alert.alert("Error", "Unable to fetch event details.");
        console.error('Error fetching event details: ', error);
      }
    };

      // Fetch the guest list for the event
      const fetchGuestDetails = async () => {
        try {
          const guestsQuery = query(collection(db, 'guests'), where('eventID', '==', eventID));
          const querySnapshot = await getDocs(guestsQuery);
          setGuests(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
          Alert.alert("Error", "Unable to fetch guest details.");
          console.error('Error fetching guest details: ', error);
        }
      };
      //Refresh guest list every time screen is focused
      useFocusEffect(
        React.useCallback(() => {
          setLoading(true);
          fetchEventDetails();
          fetchGuestDetails().then(() => setLoading(false));
          return () => { /* Cleanup if needed */ };
        }, [eventID]) 
);

const handleDeleteGuest = async(guestId) => {
  try {
    await deleteDoc(doc(db, 'guests', guestId));
    setGuests(guests.filter(guest => guest.id !== guestId));
    Alert.alert('Guest Deleted', 'The guest has been removed successfully.');
  } catch (error) {
    Alert.alert('Error', 'Unable to delete guest.');
    console.error('Error deleting guest: ', error);
  }
};

   // Function placeholders for button actions
   const handleAddGuests = () => {
    navigation.navigate('AddGuest', {
      eventID: eventID,
      userId: userId
    });
    console.log('Add Guests clicked');
  };

  const handleSendInvitation = () => {
    console.log('Send Invitation clicked');
    navigation.navigate('Invitation', {
      eventID,
      userId: userId,
    })
  };

  const handleSelectFavours = () => {
    console.log('Select Favours clicked');
    // Logic for selecting favours
    Alert.alert('Feature Coming Soon', 'Selecting favours will be available soon.');
  };

  const handleSendFavours = () => {
    console.log('Send Favours clicked');
    // Logic for sending favours
    Alert.alert('Feature Coming Soon', 'Sending favours will be available soon.');
  };

  // Render individual guest item
  const renderGuest = ({ item }) => (
    <View style={styles.guestItem}>
      <TouchableOpacity onPress={() => navigation.navigate('AddGuest', {guestId: item.id, eventID: eventID, userId: userId})}>
      <Text style={styles.guestName}>{item.guestName}</Text>
      </TouchableOpacity>
      <Text style={styles.deleteIcon} onPress={() => handleDeleteGuest(item.id)}>X</Text>
    </View>
  );

  // Task buttons
  const tasksContent = (
    <View style={styles.tasksContainer}>
      <View style={styles.buttonContainer}><Button title="Add Guests" onPress={handleAddGuests} /></View>
      <View style={styles.buttonContainer}><Button title="Send Invitation" onPress={handleSendInvitation} /></View>
      <View style={styles.buttonContainer}><Button title="Select Favours" onPress={handleSelectFavours} /></View>
      <View style={styles.buttonContainer}><Button title="Send Favours" onPress={handleSendFavours} /></View>
    </View>
  );

  // Main Component 
  return (
    <View style={styles.container}>
      {/* Event details */}
      <View style={styles.header}>
      <Text style={styles.title}>{eventDetails?.event || 'Event'}</Text>
      <Text style={styles.date}>{eventDetails?.formattedDate || 'Date'}</Text>
      <Text style={styles.time}>{eventDetails?.formattedTime || 'Time'}</Text>
    </View>

    {/* Content Section with Guest List and Tasks */}
    <View style={styles.content}>
      {/* Guest List */}
      <FlatList
          data={guests}
          renderItem={renderGuest}
          keyExtractor={item => item.id}
          style={styles.guestList}
          ListEmptyComponent={<Text>No guests found.</Text>}
        />      

        {/* Task list */}
        <View style={styles.taskList}>
          {tasksContent}
        </View>
      </View>
    
        {/* Party data section */}
        <View style={styles.partyData}>
        <Text style={styles.sectionTitle}>Party Data:</Text>
        <Text style={styles.placeholderText}>Party data will be displayed here.</Text>
        </View>
    </View>
  );
};


const styles = StyleSheet.create({
  buttonContainer: {
    marginBottom: 10,
  },
  
  container: {
    flex: 1,
    backgroundColor: '#ADD8E6',
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between', 
    paddingLeft: 10,
  },

  date: {
    fontSize: 16,
    color: 'grey',
  },

  deleteIcon: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 24,
  },

  guestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 5,
    alignItems: 'center'
  },  

  guestList: {
    flex: 1,
    marginBottom: 20,
  },

  guestName: {
    fontSize: 16,
    color: '#333',
  },

  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },

  item: {
    padding: 10, 
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  list: {
    flex: 1,
  },

  listContainer: {
    padding: 20,
  },

  name: {
    fontSize: 16,
  },

  partyData: {
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 5,
  },

  placeholderText: {
    fontSize: 16,
    color: 'grey',
    fontStyle: 'italic',
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  subHeader: {
    fontWeight: 'bold',
    padding: 10,
  },

  taskContainer: {
    padding: 10,
    margin: 5,
  },

  taskList: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  timeLeft: {
    fontSize: 16,
    color: 'blue',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  taskText: {
    fontSize: 16,
    color: 'grey',
  },

});

export default EventScreen;