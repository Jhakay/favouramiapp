import React, { useState, useEffect, useContext } from 'react';
import { Alert, Dimensions, FlatList, View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';
import { useUser } from '../utils/UserContext'; 
import { commonStyles } from '../utils/commonStyles';


//Get screen width
const screenWidth = Dimensions.get('window').width;

// Calculate the width and height for image
const itemImageWidth = screenWidth * 0.5; // 50% of the screen width
const aspectRatio = 2 / 3; // Typical thumbnail aspect ratio
const itemImageHeight = itemImageWidth / aspectRatio;
const placeholderImage = require('../assets/No-Image-Placeholder.png');

const ItemDetailsScreen = ({ route, navigation }) => { //Destructure route directly from props
  const { itemTitle, itemImageUrl, itemDescription, } = route.params;
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (!user || !user.uid) {
      console.error("User is not logged in");
      setLoading(false);
      return;
    }

    const eventsRef = collection(db, "events");
    const q = query(eventsRef, where("userID", "==", user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventsArray = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        eventsArray.push({ id: doc.id, ...doc.data() });
      });
      //console.log(eventsArray);
      setEvents(eventsArray);
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up the subscription
  }, [user.uid]);

  const handleCheck = (eventId) => {
    const newSelectedEvents = { ...selectedEvents, [eventId]: !selectedEvents[eventId] };
    setSelectedEvents(newSelectedEvents);
  };

  const handleAddFavour = () => {
    //Create logic to add details of the selected favour to selected event
    Alert.alert(
      'Feature Coming Soon', 
      'Adding favours to events will be available soon.',
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

  const renderItem = ({ item }) => (
    <View style={styles.eventItem}>
      <CheckBox
        checked={selectedEvents[item.id]}
        onPress={() => handleCheck(item.id)}
      /> 
      <Text style={styles.eventName}>{item.event}</Text>
    </View>
  );

  const renderHeader = () => (
    <>
      <Text style={styles.titleText}>{itemTitle}</Text>
      <Image
        source={itemImageUrl ? { uri: itemImageUrl } : placeholderImage}
        style={styles.imageStyle}
        resizeMode='contain'
      />
      <Text style={styles.descriptionText}>{itemDescription}</Text>
      <Text> Select an event(s) to assign this gift: </Text>
    </>
  );

  if (loading) {
    return <View style={styles.loadingContainer}><Text>Loading...</Text></View>;
  }

  return (
    <View style={commonStyles.backgroundContainer}> 
      <FlatList
      data={events}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      style={styles.listStyle}
      />
      <TouchableOpacity 
        style={commonStyles.button}
        onPress={handleAddFavour}
        >
        <Text style={commonStyles.buttonText}>Add Favour to Event</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text 
        style={commonStyles.hLinkText}
        onPress={handleCancel}
        >
          Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 16,
    marginVertical: 10,
  },
  eventItem: {
    padding: 10,
    marginTop: 10,
    backgroundColor: '#f8f8f8',
    alignItems: 'left',  
    borderRadius: 5,      
  },

  eventName: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 10,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageStyle: {
    width: '100%',
    height: 300,
  },

  listStyle: {
    marginTop: 20,   
  },

});

export default ItemDetailsScreen;