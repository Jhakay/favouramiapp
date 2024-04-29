import React, {useState} from 'react';
import {Dimensions, View, TextInput, Text, StyleSheet, Alert, Image, TouchableOpacity} from 'react-native';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {doc, getDoc} from 'firebase/firestore';
import {auth, db} from '../utils/firebaseConfig'; 
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { commonStyles } from '../utils/commonStyles';
import { useUser } from '../utils/UserContext';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false); //Toggles password visibility
    const { updateUser } = useUser();

    // Get screen width
    const { width } = Dimensions.get('window');

    //Dynamic sizing
    const dynamicFontSize = width * 0.04;

    const handleLogin = async () => {
        try {
            //Log in user with email and password using Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            //Extract UID from userCredential
            const uid = userCredential.user.uid;

            //Fetch user's details from Firestore using UID
            const userDocRef = doc(db, "users", uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = {
                    //Store user's details
                    uid: uid, 
                    name: userDocSnap.data().name, 
                };

                updateUser(userData); //Update user context
                    
                //Navigate to Dashboard upon successful login
                navigation.navigate('Dashboard');
                setEmail('');
                setPassword('');
                } else {
                    throw new Error('User document does not exist in Firestore.');
                }
            } catch (error) {
                Alert.alert("Login Failed", error.message|| "Account not found. Please check credentials or create an account.");
            }
        };

    const handleSignUpNavigation = () => {
        // Navigate to the Sign Up screen and clear input fields
        navigation.navigate('CreateAccount');
        setEmail('');
        setPassword('');
    };

    return (
        <View style={commonStyles.backgroundContainer}>
            {/* Logo Image */}
            <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode='contain'
            />

            <Text style={commonStyles.heading}>Log in</Text>
            
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={commonStyles.inputField}
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={commonStyles.inputField}
                secureTextEntry={!passwordVisible}
            />

            <TouchableOpacity 
            onPress={() => setPasswordVisible(!passwordVisible)} style={commonStyles.togglePassword}>
                <Text style={commonStyles.togglePasswordText}>
                    {passwordVisible ? 'Hide Password' : 'Show Password'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
             style={commonStyles.button}
             onPress={handleLogin}>
                <Text style={commonStyles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <Text
                style={commonStyles.hLinkText}
                onPress={handleSignUpNavigation}
                >
                    Don't have an account? Sign up!
            </Text>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ADD8E6',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    input: {
        width: '100%', 
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },

    logo: {
        width: '60%',
        height: '20%',
        marginBottom: 8,
        resizeMode: 'contain',
    },

    signupText: {
        color: '#0000ff',
        marginTop: 15,
    },

    showHide: {
        paddingBottom: 10,
        fontWeight: 'bold',
    },

    showHideText: {
        textAlign: 'center',
        color: '#4B0082',
    }
    
});

export default LoginScreen;