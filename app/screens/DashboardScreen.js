import React, {useContext} from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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

    return (
        <>
            {/* Common Header */}
            <View style={{ alignItems: 'center', backgroundColor: '#ADD8E6' }}>
                <Image
                    source={require('../assets/logo.png')}
                    style={{ width: logoWidth, height: logoHeight }}
                    resizeMode='contain'
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Hello, {firstName}!</Text>
            </View>
        {/* Tab Navigation */}
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'grey',
                tabBarStyle: {
                    backgroundColor: '#ADD8E6',
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
            <Tab.Screen name="MyEvents" component={MyEventsScreen} options={{ title: 'My Events' }} />
            <Tab.Screen name="Shop" component={ShopScreen} options={{ title: 'Shop' }} />
        </Tab.Navigator>
        </>
    );
};
  
export default Dashboard;
