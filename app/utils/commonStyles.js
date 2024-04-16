import { StyleSheet, Dimensions } from "react-native";

//Get device screen dimensions
const {width, height} = Dimensions.get('window');

//Calculate dynamic sizes
const buttonWidth = width * 0.9;
const buttonHeight = height * 0.06;
const fontSize = width * 0.03;
const inputWidth = width * 0.9;
const inputHeight = height * 0.06;

// Define common styles
export const commonStyles = StyleSheet.create({
    button: {
      backgroundColor: '#003366',
      width: buttonWidth,
      height: buttonHeight,
      padding: 10,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },

    buttonText: {
      color: '#FFFFFF',
      fontSize: fontSize * 1.5,
    },

    heading: {
        fontSize: fontSize * 1.5,
        fontWeight: 'bold',
        textAlign: 'center',

    },

    input: {
      width: inputWidth, 
      height: inputHeight,
      backgroundColor: 'white',
      marginVertical: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
  },

  hLinkText: {
    fontSize: fontSize,
    paddingTop: 5,
    color: '#4B0082',
    marginTop: 15,
  },

  togglePassword: {
    paddingBottom: 20,
  },

  togglePasswordText: {
    textAlign: 'center',
    color: 'black',
    fontSize: fontSize * 0.8,
  }
});