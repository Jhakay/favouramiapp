import React, {useState} from 'react';
import {View, TextInput, Button, Text, StyleSheet, Alert} from 'react-native';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../utils/firebaseConfig'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            //Log in user with email and password using Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            //Extract UID from userCredential
            const uid = userCredential.user.uid;

            //Store user UID in AsyncStorage
            await AsyncStorage.setItem('userData', JSON.stringify({uid: uid}));
            
            //Navigate to Dashboard upon successful login
            navigation.navigate('Dashboard');
        } catch (error) {
            //Error Handling
            Alert.alert("Login Failed", "Account not found. Please check credentials or create an account.");
            // Invite to Sign Up/Create Account
            // navigation.navigate('CreateAccount'); 
        }
    };

    return (

        <View style={styles.container}>
            
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
            />

            <Button title="Log In" onPress={handleLogin} />
            <Text
                style={styles.signupText}
                onPress={() => navigation.navigate('CreateAccount')}
                >
                    Don't have an account? Sign up!
            </Text>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
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

    signupText: {
        color: '#0000ff',
        marginTop: 15,
    },
    
});

export default LoginScreen;