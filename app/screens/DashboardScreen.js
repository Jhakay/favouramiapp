import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../utils/firebaseConfig';
import { collection, query, where, onSnapshot, getDocs, doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Dashboard = () => {
    const [fullName, setFullName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    useEffect(() => {
        let unsubscribe = () => {}; //Unsubscribe function for cleanup

        //* ***** Async function definition ***** */
        const fetchUserDataAndEvents = async() => {
            setLoading(true);
            try {
                //Retrieve user data from AsyncStorage
                const storedUserData = await AsyncStorage.getItem('userData');
                if(storedUserData) {
                    const {uid} = JSON.parse(storedUserData); 

                    //Fetch user's details from Firestore using UID
                    const usersRef = collection(db, "users");
                    const q = query(usersRef, where ("uid", "==", uid));
                    const querySnapshot = await getDocs(q);

                    console.log("Attempting to fetch user with UID: ", uid);
                    //console.log("Query snapshot: ", querySnapshot);

                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0];
                        const userData = userDoc.data();
                        console.log("User data found: ", userData); //Confirm right user

                        setFullName(userData.name);
                        setUserEmail(userData.email);

                        const userDocRef = doc(db, "users", uid); 

                        //Set up real-time event listener
                        const eventsRef = collection(db, "events");
                        const eventsQuery = query(eventsRef, where("userID", "==", userDocRef));
                        
                        unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
                            const updatedEvents = snapshot.docs.map((doc) => {
                                const event = doc.data();
                                
                                let dateTimeStr = '';
                                
                                //Check if toDate exists and is a function
                                if (event.datetime && typeof event.datetime.toDate === "function") {
                                    //If toDate function exists, use it to convert to JavaScript Date
                                    dateTimeStr = event.datetime.toDate();
                                } else if (event.datetime) {
                                    dateTimeStr = new Date(event.datetime);
                                } 

                                // Once we have a JavaScript Date object, format it
                                if (dateTimeStr instanceof Date && !isNaN(dateTimeStr)) {
                                    const options = {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    };
                                    dateTimeStr = dateTimeStr.toLocaleDateString('en-GB', options);
                                } else {
                                    dateTimeStr = '';
                                }
                                
                            return {
                                    id: doc.id,
                                    ...event,
                                    dateTime: dateTimeStr,
                                }; 
                        });
                        setEvents(updatedEvents);
                        });
                    } else {
                        console.log("User document not found for UID: ", uid);
                    }
                } else {
                    console.log("UID not found in AsyncStorage.");
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            } finally {
                setLoading(false); // Set loading to false after all operations
            }
        };
        fetchUserDataAndEvents();

        // Cleanup function
        return () => unsubscribe();
    }, []);

    const renderEvent = ({ item }) => {

        return (
            <TouchableOpacity
                style={styles.eventItem}
                onPress={() => navigation.navigate('Event', {
                    eventName: item.event,
                    eventDate: item.dateTime,
                    eventID: item.id,
                    //Other event details you want to pass
                })} 
            >    
                <View style={styles.eventItem}>
                    <Text style={styles.eventName}>{item.event}</Text>
                    <Text style={styles.eventDate}>{item.dateTime}</Text>
                    <Text style={styles.eventDescription}>{item.description}</Text>
                    <Text style={styles.eventLocation}>{item.location}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.listContainer}>
            <Text style={styles.header}>Hello {fullName}!</Text>
            <Text style={styles.header}>Email: {userEmail}!</Text>

            <FlatList 
                data={events}
                renderItem={renderEvent}
                keyExtractor={item => item.id}
                ListEmptyComponent={<Text>You are not planning any events at the moment.</Text>}
            />

            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('CreateEvent')}> 
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
            {/* Store and Events Tabs to go here  */}
        </View>
    );

};

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    listContainer: {
        flex: 1,
        padding: 20,
    },

    eventItem: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 8,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { 
            width: 0, 
            height: 2 
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        width: '100%',
    },

    eventName: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    eventDate: {
        fontSize: 14,
        color: 'grey',
        marginBottom: 5,
    },

    eventDescription: {
        fontSize: 14,
        color: 'grey',
        marginBottom: 5,
    },

    eventLocation: {
        fontSize: 14,
        color: 'grey',
        marginBottom: 5,
    },

    addButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        position: 'absolute',
        bottom: 20,
        right: 20,
    },

    addButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },

});

export default Dashboard;
