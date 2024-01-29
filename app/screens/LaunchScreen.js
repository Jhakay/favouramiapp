import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LaunchScreen = () => {
    const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/gold.png')} 
        style={styles.logo}
      />
      <Text style={styles.tagline}>Custom Cheers! Zero Waste!</Text>
      <Text style={styles.description}>
        Offering personalized digital delights for unforgettable events!
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CreateAccount')}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('LoginScreen')}
      >
        <Text style={styles.loginText}>Log In and Start Plannning!</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 200, // Adjust according to your logo's dimensions
    height: 200, // Adjust according to your logo's dimensions
    marginBottom: 20,
  },
  tagline: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#0000ff', // Adjust button color to fit your branding
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  loginText: {
    color: '#0000ff', // Adjust text color to fit your branding
    fontSize: 16,
    marginTop: 15,
  },
});

export default LaunchScreen;
