import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { RadioButton } from 'react-native-paper';
import Navbar from '../../components/Navbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Audio } from 'expo-av';
import Constants from "expo-constants";
import { AuthContext } from '../../context/AuthContext';
const BACKEND_URL = Constants.expoConfig?.env.BACKEND_URL;

const NewComplaints = ({ navigation }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [sound, setSound] = React.useState(null);
    const [showErrorMsg, setShowErrorMsg] = React.useState(false);
    const [showSuccessMsg, setShowSuccessMsg] = React.useState(false);
    const { userToken, loggedInCnic } = useContext(AuthContext)

    async function handleSpeakerClick(option) {
        console.log('Loading Sound');
        if (option == 'کوئی اور شکایت') {
            const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/complaint5.mp3'));
            setSound(sound);
            await sound.playAsync();
        }
        else if (option == 'BDO  کے روئیے سے ناخوش') {
            const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/complaint1.mp3'));
            setSound(sound);
            await sound.playAsync();
        }
        else if (option == 'قرض کی رقم کے مسائل') {
            const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/complaint2.mp3'));
            setSound(sound);
            await sound.playAsync();
        }
        else if (option == 'برانچ کے ماحول سے ناخوش') {
            const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/complaint3.mp3'));
            setSound(sound);
            await sound.playAsync();
        }
        else if (option == 'برانچ منیجر کے روئیے سے ناخوش') {
            const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/complaint4.mp3'));
            setSound(sound);
            await sound.playAsync();
        }

        console.log('Playing Sound');
    }

    async function handleNewComplaintSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/newcomplaintscreen.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

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
    }, [selectedOption]);

    const handleSubmit = async () => {
        if (selectedOption != null) {
            try {
                const url = BACKEND_URL;
                const response = await fetch(`${url}/user/submitComplaint`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        option: selectedOption,
                        cnic: loggedInCnic
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
                setSelectedOption(null);
                setTimeout(() => {
                    setShowSuccessMsg(false);
                }, 5000); // 5000 milliseconds = 5 seconds
            } catch (error) {
                console.error('Error submitting complaint:', error.message);
                // You might want to show an alert or handle the error in some way
            }
        }
        else {
            setShowErrorMsg(true);
        }
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        console.log('SELECTED OPTION: ', option)
        if (option === 'کوئی اور شکایت') {
            setSound(null);
            setSelectedOption(null);
            navigation.navigate('OtherComplaint')
        }
    };

    const options = [
        { index: 1, label: 'BDO  کے روئیے سے ناخوش', screen: 'Screen1' },
        { index: 2, label: 'قرض کی رقم کے مسائل', screen: 'Screen2' },
        { index: 3, label: 'برانچ کے ماحول سے ناخوش', screen: 'Screen3' },
        { index: 4, label: 'برانچ منیجر کے روئیے سے ناخوش', screen: 'Screen4' },
        { index: 5, label: 'کوئی اور شکایت', screen: 'Screen5', navigateIcon: true },
    ];

    return (
        <>
            <Navbar navigation={navigation} />

            <View style={styles.container}>
                <View style={styles.titleView}>
                    <TouchableOpacity onPress={handleNewComplaintSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.title}>شکایات</Text>
                </View>
                <View style={styles.horizontalLine} />
                {showSuccessMsg && (
                    <Text style={styles.successText}>شکایت دائر کر دی گئی ہے۔</Text>
                )}

                {options.map((option) => (
                    <View
                        key={option.index}
                        style={[
                            styles.optionContainer,
                            { backgroundColor: selectedOption === option.label ? '#abe0ba' : option.index % 2 === 0 ? '#f1f1d6' : '#fcfcf0' },
                        ]}
                    >
                        <Text style={styles.optionText} onPress={() => handleOptionSelect(option.label)}>{option.label}</Text>
                        {option.navigateIcon && (
                            <Icon name="angle-right" size={30} color="#9e1911" style={{ marginRight: 20 }} />
                        )}
                        <TouchableOpacity onPress={() => handleSpeakerClick(option.label)}>
                            <Icon name="volume-up" size={30} color="black" />
                        </TouchableOpacity>
                    </View>
                ))}
                {showErrorMsg && (
                    <Text style={styles.errorText}>براہ کرم ایک قسم منتخب کریں۔</Text>
                )}

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <TouchableOpacity onPress={handleSubmitSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.buttonText}>
                        درج کریں
                    </Text>
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
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderBottomColor: '#B8C1CC',
        borderBottomWidth: 1,
    },
    optionText: {
        fontSize: 18,
        marginLeft: 10,
        flex: 1,
        textAlign: 'left'
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
        marginTop: '15%'
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

export default NewComplaints;
