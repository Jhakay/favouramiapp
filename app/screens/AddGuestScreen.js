import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from '../utils/firebaseConfig'; 
import { addDoc, collection } from 'firebase/firestore';

const AddGuestScreen = ({route, navigation}) => {
  const { eventID} = route.params;
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');

  // Function to handle saving the guest information
  const handleSaveGuest = async () => {
    if (!guestName || !email) {
      //Alert if fields are empty
      Alert.alert("Missing Information", "Please provide a name and valid email to add a guest.");
      return;
    }

    try {
      // Add a new document with a generated id to the guest collection
      const docRef = await addDoc(collection(db, "guest"), { 
        guestName: guestName,
        email: email,
        eventID: eventID,
      });

      setGuestName('');
      setEmail('');

      //Display confirmation message
      Alert.alert("Guest Added", `${guestName} is now a guest to your event. Add another or exit.`, [
        {text: "OK", onPress: () => console.log("OK Pressed")}
      ]);

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("Error", "There was an error adding the guest.");
    }
  };

  // Function to handle exiting Add Guest
  const handleExit = () => {
    //Clear all input fields
    setGuestName('');
    setEmail('');
    navigation.navigate('Event', {eventID: eventID});
    console.log('Exit Add Guest');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Guest</Text>
      <TextInput
        style={styles.input}
        placeholder="Guest name:"
        onChangeText={setGuestName}
        value={guestName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email:"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />

      <TouchableOpacity onPress={handleSaveGuest} style={styles.button}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleExit} style={styles.buttonExit}>
        <Text style={styles.buttonTextExit}>Exit</Text>
      </TouchableOpacity>
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
