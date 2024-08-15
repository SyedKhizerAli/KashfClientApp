import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from '../components/Navbar';
import { Audio } from 'expo-av';
import Constants from "expo-constants";
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import { firebaseConfig } from '../../firebase.config';
import firebase from 'firebase/compat/app';
import { AuthContext } from '../context/AuthContext';
const BACKEND_URL = Constants.expoConfig?.env.BACKEND_URL;

const ChangePhoneNumber = ({ navigation }) => {
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [sound, setSound] = React.useState(null);
    const [isValidPhone, setIsValidPhone] = useState(true);
    const [isValidCode, setIsValidCode] = useState(true);
    const [codeNotSent, setCodeNotSent] = useState(false);
    const [verificationId, setVerificationId] = useState(null);
    const [showSuccessMsg, setShowSuccessMsg] = React.useState(false);
    const recaptchaVerifier = useRef(null);

    const { userToken, loggedInCnic } = useContext(AuthContext);

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
                setPhone('');
                handleSubmit();
            })
            .catch((error) => {
                console.log(error);
                setIsValidCode(false);
            })
    }

    const handleSendCode = async () => {
        try {
            if (!isValidPhone || phone === '') {
                console.log('Invalid phone number');
                setIsValidPhone(false);
                return;
            }
            const phoneNumber = phone.replace(/^\d/, '+92 ').replace(/(\d{3})(\d{7})/, '$1 $2');
            // Call sendVerification function with the obtained phoneNumber
            sendVerification(phoneNumber);
            setCodeNotSent(false);

            // Handle successful sending of OTP code
            console.log('OTP code sent successfully');
        } catch (error) {
            console.error('Error sending code:', error.message);
            setCodeNotSent(true);
            // Handle the error, e.g., show an alert
        }
    };

    const handleSubmit = async () => {
        try {
            const url = BACKEND_URL;
            const response = await fetch(`${url}/user/changePhoneNumber`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: phone,
                    cnic: loggedInCnic
                }),
            });

            if (!response.ok) {
                console.error('Changing failed:', response.status, response.statusText);
                return;
            }

            setSound(null);
            setShowSuccessMsg(true);
            setTimeout(() => {
                setShowSuccessMsg(false);
            }, 5000);
        } catch (error) {
            console.error('Error:', error.message);
            // Handle the error, e.g., show an alert
        }
    };

    async function handleEnterNumSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/enterphone.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handleChangeNumSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/changephonescreen.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handleSendOtpSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/sendotpafternumber.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handleEnterOtpSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/enterotp.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handleSubmitSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/submitphonenum.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handleNotReceivedSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/otpnotreceived.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

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
            <Navbar navigation={navigation} />
            <View style={styles.container}>
                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier} firebaseConfig={firebaseConfig} attemptInvisibleVerification={true | false /* experimental - this will make it invisible */}
                />
                <View style={styles.titleView}>
                    <TouchableOpacity onPress={handleChangeNumSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.title}>فون نمبر تبدیل کریں</Text>
                </View>
                <View style={styles.horizontalLine} />
                {showSuccessMsg && (
                    <Text style={styles.successText}>فون نمبر تبدیل ہوگیا ہے۔</Text>
                )}

                <View style={styles.middleContent}>
                    <View style={styles.inputGroup}>
                        <TouchableOpacity onPress={handleEnterNumSpeakerClick}>
                            <Icon name="volume-up" size={30} color="black" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.inputField}
                            placeholder="نیا فون نمبر درج کریں"
                            placeholderTextColor="#A9A9A9"
                            keyboardType="default"
                            value={phone}
                            onChangeText={(text) => {
                                const numericRegex = /^[0-9]*$/; // Regex to check if the string contains only numeric digits
                                const isValid = numericRegex.test(text) && text.length === 11;  // 11 digit phone number

                                // Update state and show/hide invalid message
                                setIsValidPhone(isValid);
                                setPhone(text);
                            }}
                            returnKeyType="done"
                        />
                    </View>
                    {!isValidPhone && (
                        <Text style={styles.errorText}>غلط فون نمبر۔ براہ کرم 11 اعداد کا نمبر درج کریں۔</Text>
                    )}
                    {codeNotSent && (
                        <Text style={styles.errorText}>فون نمبر کسی کے نام نہیں ہے۔ دوبارہ کوشش کریں۔</Text>
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
                        <TouchableOpacity onPress={handleSubmitSpeakerClick}>
                            <Icon name="volume-up" size={30} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.buttonText}>
                            تصدیق کریں
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.notReceived}>
                    <TouchableOpacity onPress={handleNotReceivedSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.notReceivedText}>کوڈ موصول نہیں ہوا؟</Text>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcfcf0', // Light green background
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
    middleContent: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        marginTop: 40
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
        marginBottom: 50
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
    title: {
        color: '#9e1911',
        fontSize: 34,
        fontWeight: 'bold',
        textAlign: 'right',
        marginLeft: 10,
        marginTop: -15
    },
    titleView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    horizontalLine: {
        borderBottomColor: '#9e1911',
        borderBottomWidth: 2,
        marginBottom: 10,
    },
    successText: {
        color: 'green',
        fontSize: 20,
        marginBottom: 15,
        marginTop: 10,
        textAlign: 'right',
        borderWidth: 1, // Add border width
        borderColor: 'green', // Set border color to green
        padding: 15, // Add padding for better visibility
        borderRadius: 10,
        textAlign: 'center'
    },
    errorText: {
        color: '#e67d75',
        fontSize: 20,
        marginBottom: 15,
        marginTop: 10,
        textAlign: 'right',
        borderWidth: 1, // Add border width
        borderColor: '#e67d75', // Set border color to red
        padding: 15, // Add padding for better visibility
        borderRadius: 10,
        textAlign: 'center'
    },
});

export default ChangePhoneNumber;