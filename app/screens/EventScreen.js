import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

const EventScreen = ({ route }) => {
  const { eventID } = route.params;
  const [eventDetails, setEventDetails] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    const fetchGuestDetails = async () => {
      try {
        const guestsRef = collection(db, 'guest');
        const q = query(guestsRef, where('eventID', '==', eventID));
        const querySnapshot = await getDocs(q);
        const guestsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGuests(guestsData);
      } catch (error) {
        console.error('Error fetching guest details: ', error);
      }
    };

    setLoading(true);
    fetchEventDetails().then(() => {
      fetchGuestDetails().finally(() => setLoading(false));
    });
  }, [eventID]);

  const renderGuest = ({ item }) => (
    <View style={styles.guestItem}>
      <Text style={styles.guestName}>{item.guestName}</Text>
      <Text>{item.email}</Text>
    </View>
  );


  const headerContent = (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>{eventDetails?.event || 'Event'}</Text>
        <Text style={styles.date}>{eventDetails?.datetime || 'Date/Time'}</Text>
      </View>
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Tasks List:</Text>
        <Text>Display tasks here!</Text>
      </View>
      <View style={styles.partyData}>
        <Text style={styles.sectionTitle}>Party Data:</Text>
        <Text style={styles.placeholderText}>Party data will be displayed here.</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={guests}
      renderItem={renderGuest}
      keyExtractor={item => item.id}
      ListEmptyComponent={<Text>No guests found.</Text>}
      ListHeaderComponent={headerContent} // Set header content here
      // You can also add footer content with ListFooterComponent
    />
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 16,
    color: 'grey',
  },
  timeLeft: {
    fontSize: 16,
    color: 'blue',
  },
  listContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  guestList: {
    marginBottom: 20,
  },
  guestItem: {
    fontSize: 16,
    color: 'grey',
    paddingVertical: 5,
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

});

export default EventScreen;