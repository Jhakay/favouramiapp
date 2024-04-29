import React, {useContext} from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

//Tabs
import MyEventsScreen from '../screens/tabs/MyEventsScreen';
import ShopScreen from '../screens/tabs/ShopScreen';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from '../utils/UserContext';

//Create tabs
const Tab = createBottomTabNavigator();

const Dashboard = () => {
    const { user } = useContext(UserContext); //Destructure to get user object
    const firstName = user && user.name ? user.name.split(' ')[0] : 'Guest'; //Handle case where user might be null
    
    // Get screen dimensions for dynamic sizing
    const { width } = Dimensions.get('window');
    const logoWidth = width * 0.4; 
    const logoHeight = logoWidth;
    const screenHeight = Dimensions.get('window').height;
    const headerHeight = screenHeight * 0.22;

    return (
        <>
            {/* Common Header */}
            <View style={[styles.header, { height: headerHeight }]}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode='contain'
                />
                <Text style={styles.greeting}>Hello, {firstName}!</Text>
            </View>
        {/* Tab Navigation */}
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'grey',
                tabBarStyle: {
                    backgroundColor: '#ADD9EE',
                },
                tabBarLabelStyle: {
                    fontSize: 15,
                    fontWeight: 'bold',
                },
                tabBarIconStyle: {
                    //to be decided
                }
            }}
            >
            <Tab.Screen
                name="MyEvents"
                component={MyEventsScreen} 
                options={{ 
                    title: 'My Events',
                    tabBarIcon: ({color, size}) => (
                        <MaterialIcons name="event" color={color} size={size} />
                    ), 
                    headerShown: false 
                    }} 
            />
            <Tab.Screen 
                name="Shop" 
                component={ShopScreen} 
                options={{ 
                    title: 'Shop',
                    tabBarIcon: ({color, size}) => (
                        <MaterialIcons name="shop" color={color} size={size} />
                    ),  
                    headerShown: false 
                    }} 
            />
        </Tab.Navigator>
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        backgroundColor: '#ADD9EE',
        justifyContent: 'center',
        paddingVertical: 5,
    },
    logo: {
      width: '40%', 
      aspectRatio: 1, 
      marginTop: 0,     
      marginBottom: -40,
    },
    greeting: {
      fontSize: 20,
      fontWeight: 'bold',
      paddingTop: 0,
    }
  });
  
export default Dashboard;
