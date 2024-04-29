import { StyleSheet, Dimensions } from "react-native";

//Get device screen dimensions
const {width, height} = Dimensions.get('window');

//Calculate dynamic sizes
const buttonWidth = width * 0.95;
const buttonHeight = height * 0.05;
const fontSize = width * 0.03;
const inputWidth = width * 0.95;
const inputHeight = height * 0.05;

// Define common styles
export const commonStyles = StyleSheet.create({

    backgroundContainer: {
      backgroundColor: '#add9ee',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    
    button: {
      backgroundColor: '#003365',
      width: buttonWidth,
      height: buttonHeight,
      padding: 15,
      borderRadius: 5,
      marginTop: 10,
      marginBottom:10,
      justifyContent: 'center',
      alignItems: 'center',
    },

    buttonText: {
      color: '#FFFFFF',
      fontSize: fontSize * 0.7,
      fontWeight: 'bold',
    },

    heading: {
        fontSize: fontSize * 1.5,
        fontWeight: 'bold',
        textAlign: 'center',

    },

    inputField: {
      width: inputWidth, 
      height: inputHeight,
      backgroundColor: '#e2e2e2',
      marginVertical: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
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
    color: '#003665',
    marginTop: 15,
    fontSize: fontSize * 0.8,
    fontWeight: 'bold',
    alignSelf: 'center',
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