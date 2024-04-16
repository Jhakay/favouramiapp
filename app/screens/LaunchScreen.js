import React, {useState, useEffect} from 'react';
import {Dimensions, ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import { commonStyles } from '../utils/commonStyles';
import { useNavigation } from '@react-navigation/native';

const LaunchScreen = () => {
    const navigation = useNavigation();
    const [logoSize, setLogoSize] = useState({width: 0, height: 0});
    const [dynamicStyles, setDynamicStyles] = useState({});

    //Logo dimension
    const originalLogoWidth = 441;
    const originalLogoHeight = 179;
    //Calculate aspect ratio
    const logoAspectRatio = originalLogoWidth/originalLogoHeight;
    
    useEffect(() => {
      const updateDynamicStyles = () => {
        const {width} = Dimensions.get('window');

        //Update logo size based on current screen width and original aspect ratio
        const logoWidth = width * 0.8;
        const logoHeight = logoWidth/logoAspectRatio;
        
        //Calculate font size based on screen width
        const loginFontSize = width * 0.04; 
        const descriptionFontSize = width * 0.04;
        
        setLogoSize({width: logoWidth, height: logoHeight});

        // Set dynamic styles
        setDynamicStyles({
        loginText: { fontSize: loginFontSize },
        description: { fontSize: descriptionFontSize },
      });
      };

      //Initial check
      updateDynamicStyles();

      //Listen for orientation changes
      const subscription = Dimensions.addEventListener('change', updateDynamicStyles);

      // Cleanup
      return () => {
        if (subscription?.remove) {
          subscription.remove(); // Newer versions of React Native
        } else {
          Dimensions.removeEventListener('change', updateDynamicStyles); // Older versions of React Native
        }
      };
    }, []);

  return (
    <ImageBackground
    style={styles.background}
    source={require('../assets/lights.jpg')}
    >
      <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')} 
        style={{width: logoSize.width, height: logoSize.height, marginBottom: 25}}
        resizeMode='contain'
      />
      <Text style={[styles.tagline, dynamicStyles.description]}>Custom Cheers! Zero Waste!</Text>
      <Text style={[styles.description, dynamicStyles.description]}>
        Offering personalized digital delights for unforgettable events!
      </Text>

      <TouchableOpacity
        style={commonStyles.button}
        onPress={() => navigation.navigate('CreateAccount')}
      >
        <Text style={commonStyles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('LoginScreen')}
      >
        <Text style={commonStyles.hLinkText}>Log In and Start Planning!</Text>
      </TouchableOpacity>

    </View>
      

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'space-between',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  description: {
    textAlign: 'center',
    marginBottom: 30,
  },
  
  loginText: {
    color: '#0000ff',
    marginTop: 15,
  },

  logo: {
    marginBottom: 20,
  },

  tagline: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default LaunchScreen;
