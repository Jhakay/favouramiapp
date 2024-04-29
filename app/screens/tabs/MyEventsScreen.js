import React, {useContext, useState, useEffect} from 'react';
import {useUser} from '../../utils/UserContext';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, ScrollView, Alert } from 'react-native';
import { db } from '../../utils/firebaseConfig';
import { collection, query, where, onSnapshot, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const MyEventsScreen = () => {
    const { user } = useUser();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        if (!user || !user.uid) {
            console.error("User is not logged in");
            setLoading(false);
            return;
        }

        const eventsQuery = query(collection(db, "events"), where("userID", "==", user.uid));
        const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
            const loadedEvents = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() }));
                setEvents(loadedEvents);
                setLoading(false); 
            });
            return () => unsubscribe(); //Cleanup on unmount
        }, [user.uid]);

        const renderEvent = ({ item }) => (
            <View style={styles.eventItem}>
                <TouchableOpacity
                style={styles.eventItem}
                onPress={() => navigation.navigate('Event', {
                    eventName: item.event,
                    eventDate: item.dateTimeStr,
                    eventID: item.id,//Pass eventId
                    userId: user.uid, 
                })}
            >
                <Text style={styles.eventName}>{item.event}</Text>
                <Text style={styles.eventDate}>{item.dateTimeStr}</Text>
                <Text style={styles.eventDescription}>{item.description}</Text>
                <Text style={styles.eventLocation}>{item.location}</Text>
                </TouchableOpacity>

                <View style={styles.actionContainer}>
                <Text style={styles.actionLink} onPress={() => handleAmend(item.id)}>Amend</Text>
                <Text style={styles.actionLink} onPress={() => handleDelete(item.id)}>Delete</Text>
                </View>
            </View>
        );

        //Function - Delete Event
        const handleDelete = async (eventId) => {
            Alert.alert(
                "Confirm Delete",
                "Are you sure you want to delete this event. This cannot be undone!",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "OK", onPress: async () => {
                        try {
                            await deleteDoc(doc(db, "events", eventId));
                            //Set the MyEventsPage to refresh here
                        } catch (error) {
                            console.error("Error removing document: ", error);
                            Alert.alert("Error", "Failed to delete the event.");
                        }
                    }
                }
                ]
            );
        };

        //Amend 
        const handleAmend = (eventId) => {
            navigation.navigate('CreateEvent', { eventID: eventId });
        };
        
        if (loading) {
                return <View style={styles.loadingContainer}><Text>Loading...</Text></View>;
            }

        return (
            <View style={styles.container}>
            <Text style={styles.headerText}>Your Events</Text>
            <FlatList 
                data={events}
                renderItem={renderEvent}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={<Text style={styles.regularText}>Looks like you are not planning any events right now. Why not hit the blue button and get planning?</Text>}
            />
            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('CreateEvent')}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
            </View>
    );
    };

const styles = StyleSheet.create({
        
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },

    actionLink: {
        color: 'blue',
        fontWeight: 'bold',
    },
    
    addButton: {
        backgroundColor: '#003365',
        borderRadius: 30,
        bottom: 20,
        right: 20,
        alignSelf: 'center',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },

    addButtonText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: '900',
    },

    container: {
        flex: 1,
        backgroundColor: '#ADD8E6',
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

    eventItem: {
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { 
            width: 0, 
            height: 2 
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        alignSelf: 'center',
        width: '95%',
    },

    eventList: {
        flex: 1,
    },

    eventLocation: {
        fontSize: 14,
        color: 'grey',
        marginBottom: 5,
    },

    eventName: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    greeting: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    greetingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: Dimensions.get('window').height / 20,
    },

    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 20,
        textAlign: 'center',
      },
    
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    logoContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: Dimensions.get('window').height / 12,
    },

    regularText: {
        marginTop: 15,
        fontSize: 18,
        paddingLeft: 18,
        color: 'grey'
    },

});

export default MyEventsScreen;
