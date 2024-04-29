import React, {useState} from 'react';
import { Dimensions, View, TextInput, Button, StyleSheet, Text, Alert, TouchableOpacity, Image} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, setDoc, doc, collection } from 'firebase/firestore';
import {auth, db} from '../utils/firebaseConfig';
import { commonStyles } from '../utils/commonStyles';
import { useNavigation } from '@react-navigation/native';


const CreateAccountScreen = () => {
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailValid, setEmailValid] = useState(true);
    const [password, setPassword] = useState('');
    const [passwordValid, setPasswordValid] = useState(true);
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    //Email validation criteria
    const validateEmail = (email) => {
        const re =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }

    //Password validation criteria
    const validatePassword = (password) => {
        const minLength = 4;
        //const hasNumber = /\d/.test(password);

        return password.length >= minLength; //&& hasNumber;
    };

    //Determine password strength
    const determinePasswordStrength = (password) => { 
        let strength = '';
        const lengthCriteria = password.length >= 8;
        const numberCriteria = /\d/.test(password);
        const uppercaseCriteria = /[A-Z]/.test(password);
        const lowercaseCriteria = /[a-z]/.test(password);
        const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const meetCriteria = [lengthCriteria, numberCriteria, uppercaseCriteria, lowercaseCriteria, specialCharCriteria].filter(Boolean).length;

        switch (meetCriteria) {
            case 5: strength = 'Very Strong'; break;
            case 4: strength = 'Strong'; break;
            case 3: strength = 'Average'; break;
            case 2: strength = 'Weak'; break;
            default: strength = 'Very Weak';            
        }
        return strength;
    };

    //Toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    //Update email state and validation state
    const handleEmailChange = (text) => {
        setEmail(text);
        setEmailValid(validateEmail(text));
    };

    //Update password state and validation state
    const handlePasswordChange = (text) => {
        setPassword(text);
        setPasswordValid(validatePassword(text));
        setPasswordStrength(determinePasswordStrength(text));
    };

    const handleSignup = async () => {
        if(!validateEmail(email)) {
            setEmailValid(false);
            Alert.alert('Invalid Email', 'Please enter a valid email address');
            return;
        }

        if (!validatePassword(password)) {
            setPasswordValid(false);
            Alert.alert('Invalid Passord', 'Password does not meet requirements');
            //Highlight requirements
            return;
        }

        try {
            //Create user with email and password using Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password); //Commits user to Firebase Authentication
            const user = userCredential.user;
            console.log('User account created!');

            //Add additional data to Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid, //Store user's UID for reference
                name: name,
                email: email,
            });
            console.log('Firestore document written with ID: ', user.uid);
            Alert.alert(
                "Congratulation!",
                "You have created an account. Log in to plan your next event",
                [
                    {
                        text: "OK",
                    onPress: () => {
                        setName('');
                        setEmail('');
                        setPassword('');
                        //Navigate to Login Screen
                        navigation.navigate('LoginScreen');
                    }
                }
                ]
            );

        } catch (error) {
            console.error('Error adding document: ', error);
            Alert.alert('Signup Failed', error.message|| 'An unexpected error occurred');
        }
    };  

    return (

        <View style={commonStyles.backgroundContainer}>
            {/* Logo Image */}
            <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode='contain'
            />

            <Text style={commonStyles.heading}>Create Account</Text>

            <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={commonStyles.inputField}
            />
            
            <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={[commonStyles.inputField, !emailValid && styles.invalidInput]} //Invalid style if input is not valid
            />

            <TextInput
            placeholder="Password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={!passwordVisible} //Toggle based on state
            style={[commonStyles.inputField, !passwordValid && styles.invalidInput]}
            />

            <TouchableOpacity 
            onPress={() => setPasswordVisible(!passwordVisible)} style={commonStyles.togglePassword}>
                <Text style={commonStyles.togglePasswordText}>
                    {passwordVisible ? 'Hide Password' : 'Show Password'}</Text>
            </TouchableOpacity>

            <Text style={styles[passwordStrength.replace(' ', '')]}>Password Strength: {passwordStrength}</Text>
            
            {/* Display password requirements */}
            <View>
                <Text></Text>
            <Text>Password must contain at least:</Text>
                <Text style={password.length >= 8 ? styles.valid : styles.invalid}>- 8 characters</Text>
                <Text style={/\d/.test(password) ? styles.valid : styles.invalid}>- A number</Text>
                <Text style={/[A-Z]/.test(password) ? styles.valid : styles.invalid}>- An uppercase letter</Text>
                <Text style={/[a-z]/.test(password) ? styles.valid : styles.invalid}>- A lowercase letter</Text>
                <Text style={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? styles.valid : styles.invalid}>- A special character</Text>
                <Text></Text>
            </View>

            <TouchableOpacity
             style={commonStyles.button}
             onPress={handleSignup}>
                <Text style={commonStyles.buttonText}>Create Account</Text>
            </TouchableOpacity>
            
        </View>
    );
    
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#9370DB',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    input: {
        width: '80%',
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
    },

    invalid: {
        color: 'red',
    },

    invalidInput: {
        borderColor: 'red',
    },

    logo: {
        width: '60%',
        height: '20%',
        marginBottom: 8,
        resizeMode: 'contain',
    },

    valid: {
        color: 'green',
    },

    /***** PASSWORD STRENGTH *****/
    VeryWeak: { color: 'red' },
    Weak: { color: 'orange' },
    Average: { color: 'yellow' },
    Strong: { color: 'lightgreen' },
    VeryStrong: { color: 'green' },
    /*****************/


});

export default CreateAccountScreen;