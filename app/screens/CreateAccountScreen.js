import React, {useState} from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import {auth, db} from '../utils/firebaseConfig';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CreateAccountScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailValid, setEmailValid] = useState(true);
    const [password, setPassword] = useState('');
    const [passwordValid, setPasswordValid] = useState(true);
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false); //Toggles password visibility
    
    const navigation = useNavigation();

    //Function to display password requirements
    const renderPasswordRequirements = () => {
        return (
            <View style={styles.passwordRequirements}>
                <Text>Password must contain:</Text>
                <Text> - At least 8 characters</Text>
                <Text> - At least one number</Text>
                <Text> - At least one uppercase letter</Text>
                <Text> - At least one lowercase letter</Text>
                <Text> - At least one special character (!@#$%^&amp;*(),.?":{}|&lt;&gt;)</Text>
            </View>
        );
    };

    //Email validation criteria
    const validateEmail = (email) => {
        const re =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }

    //Password validation criteria
    const validatePassword = (password) => {
        const minLength = 8;
        const hasNumber = /\d/.test(password);

        return password.length >= minLength && hasNumber;
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



    //Update email state and validation state
    const handleEmailChange = (text) => {
        const trimmedEmail = text.trim();
        setEmail(trimmedEmail);
        setEmailValid(validateEmail(trimmedEmail));
    };

    //Update password state and validation state
    const handlePasswordChange = (text) => {
        setPassword(text);
        setPasswordValid(validatePassword(text));
        setPasswordStrength(determinePasswordStrength(text));
    };

    // Reset all fields
    const resetFields = () => {
        setName('');
        setEmail('');
        setPassword('');
        setEmailValid(true);
        setPasswordValid(true);
        setPasswordStrength('');
    };

    const handleSignup = async () => {
        const trimmedEmail = email.trim();

        if(!validateEmail(trimmedEmail)) {
            setEmailValid(false);
            Alert.alert('Invalid Email', 'Please enter a valid email address');
            return;
        }

        if (!validatePassword(password)) {
            setPasswordValid(false);
            Alert.alert('Invalid Password', 'Password does not meet requirements');
            //Highlight requirements
            return;
        }

        try {
            //Create user with email and password using Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            //console.log('User account created');

            //Add additional data to Firestore
            const docRef = await addDoc(collection(db, "users"), {
                uid: user.uid, //Store user's UID for reference
                name: name,
                email: email,
            });
            //console.log('Firestore document written with ID: ', docRef.id);
            //Confirmation alert
            Alert.alert(
                'Congratulations!',
                'You account has been created. Log in and start planning!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            resetFields();
                            // Navigate to log-in screen
                            navigation.navigate('LoginScreen'); 
                        }
                    }
                ]
            );

        } catch (error) {
            console.error('Error adding document: ', error);
            Alert.alert('Signup Failed', error.message);
        }
    };  

    return (
        <View style={styles.container}>
            <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            />
            
            <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, !emailValid && styles.invalidInput]} //Invalid style if input is not valid
            />

            <TextInput
            placeholder="Password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={!passwordVisible} //Toggle visibility
            style={[styles.input, !passwordValid && styles.invalidInput]} //Invalid style if input is not valid
            />
            
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.showHideButton}>
                <Text>{passwordVisible ? 'Hide Password' : 'Show Password'}</Text>
            </TouchableOpacity>

            <Text style={styles[passwordStrength.replace(' ', '')]}>Password Strength: {passwordStrength}</Text>
            {renderPasswordRequirements()}
            <Button title="Create Account" onPress={handleSignup} />
        </View>
    );
    
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    input: {
        width: '80%',
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
    },

    invalidInput: {
        borderColor: 'red',
    },

    passwordRequirements: {
        width: '80%',
        alignItems: 'flex-start',
        margin: 10,
        padding: 10,
    },

    /***** PASSWORD STRENGTH *****/
    VeryWeak: { color: 'red' },
    Weak: { color: 'orange' },
    Average: { color: 'yellow' },
    Strong: { color: 'lightgreen' },
    VeryStrong: { color: 'green' },
    /*****************/

    showHideButton: {
        fontWeight: 'bold',
    },


});

export default CreateAccountScreen;