import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from '../utils/firebaseConfig'; 
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { commonStyles } from '../utils/commonStyles';

const AddGuestScreen = ({route, navigation}) => {
  const { eventID, userId, guestId} = route.params;
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    console.log("Received parameters:", { eventID, userId, guestId });
    //Fetch existing guest for editing
    if (guestId) {
      const fetchGuestDetails = async () => {
        const guestRef = doc(db, 'guests', guestId);
        const guestSnap = await getDoc(guestRef);
        if (guestSnap.exists()) {
          const guestData = guestSnap.data();
          setGuestName(guestData.guestName);
          setEmail(guestData.email);
        } else {
          Alert.alert("Error", "Guest not found.");
        }
      };
      fetchGuestDetails();
    }
  }, [guestId]);//Track dependency on guestId

  // Function to handle saving the guest information
  const handleSaveGuest = async () => {
    if (!guestName || !email) {
      //Alert if fields are empty
      Alert.alert("Missing Information", "Please provide a name and valid email to add a guest.");
      return; 
    }

    try {
      if (guestId) {
      // Update existing guest
      //const guestRef = doc(db, 'guests', guestId);
      await updateDoc(doc(db, 'guests', guestId), {
        guestName: guestName,
        email: email,
        eventID: eventID,//Map data
        userId: userId,
      });
      Alert.alert("Success", "Guest's details updated successfully!");
    } else {
      //Add new guest
      const docRef = await addDoc(collection(db, "guests"), {
        guestName: guestName,
        email: email,
        eventID: eventID,
        userId: userId,
      });
      Alert.alert("Success", "Guest added successfully!");
    }
  } catch (e) {
    console.error("Error saving guest: ", e);
    Alert.alert("Error", "There was an error processing your request.");
  }

  setGuestName('');
  setEmail('');
};

  // Function to handle exiting Add Guest
  const handleExit = () => {
    //Clear all input fields
    setGuestName('');
    setEmail('');
    navigation.goBack();
    console.log('Exit Add Guest');
  };

  return (
    <View style={commonStyles.backgroundContainer}>
      <Text style={styles.header}>{guestId ? "Edit Guest" : "Add Guest"}</Text>
      <TextInput
        style={commonStyles.inputField}
        placeholder="Guest name:"
        onChangeText={setGuestName}
        value={guestName}
      />
      
      <TextInput
        style={commonStyles.inputField}
        placeholder="Email:"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />

      <TouchableOpacity onPress={handleSaveGuest} style={commonStyles.button}>
        <Text style={commonStyles.buttonText}>{guestId ? "Update Guest" : "Save Guest"}</Text>
      </TouchableOpacity>
      
      <Text
        style={commonStyles.hLinkText}
          onPress={handleExit}
        >
          Exit
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonExit: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'blue',
  },
  buttonTextExit: {
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default AddGuestScreen;
