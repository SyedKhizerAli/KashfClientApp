import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Audio } from 'expo-av';
import Constants from "expo-constants";
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import { firebaseConfig } from '../../firebase.config';
import { AuthContext } from '../context/AuthContext';
import firebase from 'firebase/compat/app';
const BACKEND_URL = Constants.expoConfig?.env.BACKEND_URL;

const Signup = ({ navigation }) => {
    const [cnic, setCnic] = useState('');
    const [code, setCode] = useState('');
    const [sound, setSound] = React.useState(null);
    const [isValidCnic, setIsValidCnic] = useState(true);
    const [isValidCode, setIsValidCode] = useState(true);
    const [codeNotSent, setCodeNotSent] = useState(false);
    const [verificationId, setVerificationId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const recaptchaVerifier = useRef(null);

    const { login } = useContext(AuthContext);

    useEffect(() => {
        setIsValidCode(true);
    }, [code]);

    const sendVerification = (phoneNumber) => {
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        phoneProvider
            .verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
            .then(setVerificationId);
    }

    const confirmCode = () => {
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId, code
        );
        firebase.auth().signInWithCredential(credential)
            .then(() => {
                setCode('');
                // console.log('Login successful');
                // setSound(null);
        handleSignup();
            // navigation.navigate('Dashboard');
        })
        .catch((error) => {
            console.log(error);
            setIsValidCode(false);
        })
    }

    const handleSendCode = async () => {
        try {
            // Check if isValidCnic is true
            if (!isValidCnic || cnic === '') {
                console.log('Invalid CNIC');
                setIsValidCnic(false);
                // You might want to show an alert or update state to indicate the failure
                return;
            }

            const url = BACKEND_URL;
            const response = await fetch(`${url}/user/sendCodeWhenSignup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cnicNum: cnic,
                }),
            });

            if (!response.ok) {
                // Handle error response from the server
                console.error('Sending code failed:', response.status, response.statusText);
                setCodeNotSent(true);
                return;
            }
            else {

                // Extract phone number from the response
                const data = await response.json();
                const phoneNumber = data.phoneNumber;

                // Call sendVerification function with the obtained phoneNumber
                sendVerification(phoneNumber);
                setCodeNotSent(false);

                // Handle successful sending of OTP code
                console.log('OTP code sent successfully');
                // If needed, you can perform other actions as needed
            }

            // Update state or perform other actions as needed
        } catch (error) {
            // Handle other errors, such as network issues
            console.error('Sending code error:', error.message);
            setCodeNotSent(true);
        }
    };

    const handleSignup = async () => {
        try {
            // Assuming cnic and verificationCode are the state variables holding CNIC and verification code
            const url = BACKEND_URL;
            const response = await fetch(`${url}/user/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cnic: cnic,
                }),
            });

            if (!response.ok) {
                // Handle error response from the server
                console.error('Signup failed:', response.status, response.statusText);
                // You might want to show an alert or update state to indicate the failure
                return;
            }

            const data = await response.json();
            const token = data.token;

            // Handle successful signup response
            console.log('Signup successful');
            login(token, cnic);
            setSound(null);
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                setCnic('');
                setCode('');
                navigation.navigate('Dashboard');
            }, 1000);
        } catch (error) {
            // Handle other errors, such as network issues
            console.error('Signup error:', error.message);
            // You might want to show an alert or update state to indicate the failure
        }
    };


    async function handleCnicSpeakerClick() {
        console.log('Loading sound')
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/entercnic.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    };

    async function handleSendOtpSpeakerClick() {
        console.log('Loading sound')
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/sendotp.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    };

    async function handleEnterOtpSpeakerClick() {
        console.log('Loading sound')
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/enterotp.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    };

    async function handleSignupSpeakerClick() {
        console.log('Loading sound')
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/afterotp.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    };

    async function handleNotReceivedSpeakerClick() {
        console.log('Loading sound')
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/otpnotreceived.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    };

    React.useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    return (
        <>
            <View style={styles.container}>
                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier} firebaseConfig={firebaseConfig} attemptInvisibleVerification={true | false /* experimental - this will make it invisible */}
                />
                <View style={styles.header}>
                    <Image source={require('./../../assets/images/kashf-logo.png')} style={styles.headerImage} />
                    <Text style={styles.headerText}>کشف آسانی میں خوش آمدید</Text>
                    <Text style={styles.belowHeaderText}>براہ کرم سائن اپ کریں</Text>
                </View>

                <View style={styles.inputGroup}>
                    <TouchableOpacity onPress={handleCnicSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.inputField}
                        placeholder="شناختی کارڈ نمبر"
                        placeholderTextColor="#A9A9A9"
                        keyboardType="default"
                        value={cnic}
                        onChangeText={(text) => {
                            const numericRegex = /^[0-9]*$/; // Regex to check if the string contains only numeric digits
                            const isValid = numericRegex.test(text) && text.length === 13;

                            // Update state and show/hide invalid message
                            setIsValidCnic(isValid);
                            setCnic(text);
                        }
                        }
                        returnKeyType="done"
                    />
                </View>
                {!isValidCnic && (
                    <Text style={styles.errorText}>غلط شناختی کارڈ نمبر۔ براہ کرم 13 اعداد کا نمبر درج کریں۔</Text>
                )}
                {codeNotSent && (
                    <Text style={styles.errorText}>شناختی کارڈ نمبر کسی صارف کا نہیں ہے۔ دوبارہ کوشش کریں۔</Text>
                )}

                <TouchableOpacity style={styles.otpbutton} onPress={handleSendCode}>
                    <TouchableOpacity onPress={handleSendOtpSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.buttonText}>کوڈ بھیجیں
                    </Text>
                </TouchableOpacity>

                <View style={styles.inputGroup}>
                    <TouchableOpacity onPress={handleEnterOtpSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.inputField}
                        placeholder="کوڈ درج کریں"
                        placeholderTextColor="#A9A9A9"
                        keyboardType="default"
                        value={code}
                        onChangeText={(text) => setCode(text)}
                        returnKeyType="done"
                    />
                </View>
                {!isValidCode && (
                    <Text style={styles.errorText}>کوڈ غلط ہے۔ دوبارہ درج کریں۔</Text>
                )}

                <TouchableOpacity style={styles.button} onPress={confirmCode}>
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#ffffff" />) :
                        <TouchableOpacity onPress={handleSignupSpeakerClick}>
                            <Icon name="volume-up" size={30} color="black" />
                        </TouchableOpacity>}
                    <Text style={styles.buttonText}>
                        سائن اپ
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.notReceived} onPress={handleSendCode}>
                    <TouchableOpacity onPress={handleNotReceivedSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.notReceivedText}>کوڈ موصول نہیں ہوا؟</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcfcf0', // Light green background
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
    },
    headerImage: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    headerText: {
        fontSize: 40,
        textAlign: 'center',
        marginTop: 10,
        color: '#9e1911',
    },
    belowHeaderText: {
        fontSize: 20,
        marginTop: 10,
        color: '#9e1911',
        fontWeight: 'bold',
    },
    notReceivedText: {
        fontSize: 15,
        marginTop: 10,
        color: '#9e1911',
        fontWeight: 'bold',
        paddingLeft: 10
    },
    inputField: {
        borderWidth: 0,
        backgroundColor: '#f1f1d6',
        borderRadius: 8,
        padding: 20,
        marginLeft: 10,
        width: '100%',
        textAlign: 'left',
        flex: 1,
        // color: '#BDBDBD'
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#cb847c',
        borderRadius: 50,
        padding: 15,
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    otpbutton: {
        backgroundColor: '#cb847c',
        borderRadius: 50,
        padding: 15,
        alignItems: 'center',
        width: '40%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        paddingLeft: 10
    },
    notReceived: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 15
    },
    errorText: {
        color: '#e67d75',
        fontSize: 20,
        marginBottom: 15,
        marginTop: -10,
        textAlign: 'right',
        borderWidth: 1, // Add border width
        borderColor: '#e67d75', // Set border color to red
        padding: 5, // Add padding for better visibility
        borderRadius: 10,
        textAlign: 'center'
    },
});

export default Signup;