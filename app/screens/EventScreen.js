import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

const EventScreen = ({ route, navigation }) => {
  const { eventID } = route.params; // this should be just the ID, not the full path
  const [eventDetails, setEventDetails] = useState(null);
  const [guests, setGuests] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the details of the event
  const fetchEventDetails = async () => {
    if (eventID) {
      try {
        const eventRef = doc(db, 'events', eventID);
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
          const eventData = eventSnap.data();
          Object.keys(eventData).forEach(key => {
            if (eventData[key] && typeof eventData[key].toDate === 'function') {
              eventData[key] = eventData[key].toDate().toString();
            }
          });
          setEventDetails(eventData);
        } else {
          console.log('No such event!');
        }
      } catch (error) {
        console.error('Error fetching event details: ', error);
      }
    }
  };

  // Fetch the guest list for the event
  const fetchGuestDetails = async () => {
    if (eventID) {
      try {
        const guestsQuery = query(collection(db, 'guest'), where('eventID', '==', eventID));

        const querySnapshot = await getDocs(guestsQuery);
        if (!querySnapshot.empty) {
          const guestsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setGuests(guestsData);
        } else {
          console.log('No guests found for this event');
          setGuests([]); // In case no guests are found, set to empty array
        }
      } catch (error) {
        console.error('Error fetching guest details: ', error);
      }
    }
  };

  // Effect to fetch event and guest details
  useEffect(() => {
    const fetchData = async () => {
      await fetchEventDetails();
      await fetchGuestDetails();
    };

    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, [eventID]);

   // Function placeholders for button actions
   const handleAddGuests = () => {
    navigation.navigate('AddGuest', {eventID: eventID});
    console.log('Add Guests clicked');
    // Add your logic for adding guests
  };

  const handleSendInvitation = () => {
    console.log('Send Invitation clicked');
    // Add your logic for sending invitations
  };

  const handleSelectFavours = () => {
    console.log('Select Favours clicked');
    // Add your logic for selecting favours
  };

  const handleSendFavours = () => {
    console.log('Send Favours clicked');
    // Add your logic for sending favours
  };

  // Render individual guest item
  const renderGuest = ({ item }) => (
    <View style={styles.guestItem}>
      <Text style={styles.guestName}>{item.guestName}</Text>
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
      <Text style={styles.date}>{eventDetails?.datetime || 'Date/Time'}</Text>
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
    backgroundColor: '#fff',
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between', 
  },

  date: {
    fontSize: 16,
    color: 'grey',
  },

  guestItem: {
    fontSize: 16,
    color: 'grey',
    paddingVertical: 5,
  },  

  guestList: {
    flex: 1,
    marginBottom: 20,
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