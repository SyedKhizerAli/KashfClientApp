import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Button, Keyboard, Alert } from 'react-native';
import Navbar from '../../components/Navbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Audio } from 'expo-av';
import Constants from "expo-constants";
import { AuthContext } from '../../context/AuthContext';
const BACKEND_URL = Constants.expoConfig?.env.BACKEND_URL;

const OtherComplaint = ({ navigation }) => {
    const [sound, setSound] = React.useState(null);
    const [recording, setRecording] = React.useState(null);
    const [recordingURI, setRecordingURI] = React.useState(null);
    const [showTimeAlert, setShowTimeAlert] = useState(true);
    const [complaintText, setComplaintText] = React.useState('');
    const [showErrorMsg, setShowErrorMsg] = React.useState(false);
    const [showSuccessMsg, setShowSuccessMsg] = React.useState(false);
    const [isKeyboardActive, setIsKeyboardActive] = useState(false);
    const { userToken, loggedInCnic } = useContext(AuthContext)

    async function handleOtherComplaintSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/othercomplaint.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setIsKeyboardActive(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setIsKeyboardActive(false);
            }
        );

        // Clean up listeners
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const handleDonePress = () => {
        // Additional logic to handle "Done" press
        // For example, you might want to dismiss the keyboard
        Keyboard.dismiss();
    };

    async function handleSubmitSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/submitcomplaint.mp3')
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

    React.useEffect(() => {
        setShowErrorMsg(false);
    }, [complaintText, recording]);

    const handleTextChange = (text) => {
        setComplaintText(text);
    };

    const handleSubmit = async () => {
        if (complaintText === '' && recording === null) {
            setShowErrorMsg(true);
        }
        else {
            try {
                const url = BACKEND_URL;
                const response = await fetch(`${url}/user/submitComplaint`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        option: 'کوئی اور شکایت',
                        text: complaintText,
                        recording: recording,
                        cnic: loggedInCnic
                        // Add other complaint details as needed
                    }),
                });

                if (!response.ok) {
                    console.error('Failed to submit complaint:', response.status, response.statusText);
                    // You might want to show an alert or handle the error in some way
                    return;
                }

                // Handle successful submission (update state, navigate, etc.)
                console.log('Complaint submitted successfully');
                setShowSuccessMsg(true);
                setComplaintText('');
                setRecording(null);
                setRecordingURI(null);
                setTimeout(() => {
                    setShowSuccessMsg(false);
                }, 5000); // 5000 milliseconds = 5 seconds
            } catch (error) {
                console.error('Error submitting complaint:', error.message);
                // You might want to show an alert or handle the error in some way
            }
        }
    };

    async function startRecording() {
        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording..');
            const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            console.log('Recording started');

            setTimeout(() => {
                setShowTimeAlert(true);
                if (showTimeAlert) {
                    Alert.alert('Recording Stopped', 'Recording can not be more than 30 seconds');
                    stopRecording()
                }
                setShowTimeAlert(false)
            }, 30000);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        setShowTimeAlert(false)
        console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync(
            {
                allowsRecordingIOS: false,
            }
        );
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
        setRecordingURI(uri);
    }

    async function playRecording() {
        const soundObject = new Audio.Sound();

        try {
            await soundObject.loadAsync({ uri: recordingURI });
            await soundObject.playAsync();
        } catch (error) {
            console.error('Failed to play the recording', error);
        }
    }

    return (
        <>
            <Navbar navigation={navigation} />

            <View style={styles.container}>
                <View style={styles.titleView}>
                    <TouchableOpacity onPress={handleOtherComplaintSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.title}>شکایات</Text>
                </View>
                <View style={styles.horizontalLine} />
                {showSuccessMsg && (
                    <Text style={styles.successText}>شکایت دائر کر دی گئی ہے۔</Text>
                )}

                {/* Text area */}
                <View>
                    <TextInput
                        style={styles.textArea}
                        placeholder="اپنی شکایت یہاں لکھیں۔"
                        placeholderTextColor="#A9A9A9"
                        multiline
                        numberOfLines={4}
                        onChangeText={handleTextChange}
                        value={complaintText}
                        returnKeyType="done"
                    />
                    {isKeyboardActive && (
                        <View>
                            <Button title="Done" onPress={handleDonePress} />
                        </View>
                    )}
                </View>

                {/* Mic icon */}
                <View style={styles.micContainer}>
                    <TouchableOpacity style={styles.micCircle} onPress={recording ? stopRecording : startRecording}>
                        {recording ?
                            <Icon name="stop-circle" size={30} color="white" />
                            : <Icon name="microphone" size={30} color="white" />}
                    </TouchableOpacity>

                    {recordingURI && (
                        <TouchableOpacity style={styles.micCircle} onPress={playRecording}>
                            <Icon name="play-circle" size={30} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
                {showErrorMsg && (
                    <Text style={styles.errorText}>براہ کرم اپنی شکایت لکھیں یا ریکارڈ کریں پھر جمع کرائیں۔</Text>
                )}

                {/* Submit button */}
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <TouchableOpacity onPress={handleSubmitSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.buttonText}>درج کریں</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcfcf0', // Light green background
        padding: 20,
    },
    title: {
        color: '#9e1911',
        fontSize: 34,
        fontWeight: 'bold',
        textAlign: 'right',
        marginLeft: 10,
        marginTop: -15,
    },
    titleView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    horizontalLine: {
        borderBottomColor: '#9e1911',
        borderBottomWidth: 2,
        marginBottom: 10,
    },
    textArea: {
        backgroundColor: '#f1f1d6',
        borderRadius: 15,
        padding: 10,
        marginTop: 15,
        textAlignVertical: 'top',
        height: '55%',
        fontSize: 20
    },
    micContainer: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: -100
    },
    micCircle: {
        backgroundColor: '#cb847c',
        borderRadius: 50,
        padding: 15,
        width: 60,
        alignItems: 'center',
        marginBottom: 20
    },
    button: {
        backgroundColor: '#cb847c',
        borderRadius: 50,
        padding: 15,
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10%'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        paddingLeft: 10
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
});

export default OtherComplaint;
