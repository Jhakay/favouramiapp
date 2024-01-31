import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LaunchScreen from './app/screens/LaunchScreen.js';
import CreateAccountScreen from './app/screens/CreateAccountScreen.js';
import LoginScreen from './app/screens/LoginScreen.js';
import Dashboard from './app/screens/DashboardScreen.js';
import CreateEventScreen from './app/screens/CreateEventScreen.js';
import EventScreen from './app/screens/EventScreen.js';
import AddGuestScreen from './app/screens/AddGuestScreen.js';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LaunchScreen">
        <Stack.Screen name="LaunchScreen" component={LaunchScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
        <Stack.Screen name="Event" component={EventScreen} />
        <Stack.Screen name="AddGuest" component={AddGuestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
