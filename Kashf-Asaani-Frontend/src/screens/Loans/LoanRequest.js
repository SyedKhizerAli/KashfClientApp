import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Navbar from '../../components/Navbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import Constants from "expo-constants";
import { AuthContext } from '../../context/AuthContext';
const url = Constants.expoConfig?.env.BACKEND_URL;

const LoanRequest = ({ navigation }) => {
    const [loanRequestExists, setLoanRequestExists] = useState(false);
    const [loanRequest, setLoanRequest] = useState(null);
    const [sliderValue, setSliderValue] = useState(0);
    const [sound, setSound] = useState(null);
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);
    const [showErrorMsg2, setShowErrorMsg2] = useState(false);
    const [showErrorMsg3, setShowErrorMsg3] = useState(false);
    const [showSuccessMsg2, setShowSuccessMsg2] = useState(false);
    const [purpose, setPurpose] = useState('');
    const { userToken, loggedInCnic } = useContext(AuthContext);

    useEffect(() => {
        // Fetch existing loan requests from the backend when the component mounts
        fetchExistingLoanRequest(userToken);
    }, []);

    useEffect(() => {
        setShowErrorMsg(false);
    }, [sliderValue]);

    useEffect(() => {
        setShowErrorMsg3(false);
    }, [purpose]);

    const fetchExistingLoanRequest = async (userToken) => {
        try {
            const response = await fetch(`${url}/user/loanRequest?cnic=${loggedInCnic}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Failed to fetch existing loan request:', response.status, response.statusText);
                return;
            }

            const data = await response.json();
            if (data.loanRequest === null) {
                setLoanRequestExists(false);
            }
            else {
                setLoanRequest(data.loanRequest);
                setLoanRequestExists(true);
            }
        } catch (error) {
            console.error('Error fetching existing loan request:', error.message);
        }
    };

    const handleSliderChange = (value) => {
        setSliderValue(value);
    };

    const handleSpeakerClick = () => {
        // Handle speaker icon click logic here
        console.log('Speaker icon clicked!');
    };

    async function handleLoanReqSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/loanrequestscreen.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handleEnterAmountSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/enteramount.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handleSubmitSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/submitloanrequest.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handleEnterPurposeSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/loanreqpurpose.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handleAmountSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/loanreqamount.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handlePurposeSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/loanreqpurpose2.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handleStatusSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/loanreqstatus.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handleDateSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/loanreqdate.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handleCancelSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/cancelloanreq.mp3')
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

    const handleSubmit = async () => {
        if (sliderValue === 0) {
            setShowErrorMsg(true);
        }
        else if (purpose === '') {
            setShowErrorMsg3(true);
        }
        else {
            try {
                // Replace 'http://your-backend-url/api/requestLoan' with your actual backend endpoint
                const response = await fetch(`${url}/user/loanRequest`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ amount: sliderValue, cnic: loggedInCnic }),
                });

                if (!response.ok) {
                    console.error('Failed to request a loan:', response.status, response.statusText);
                    // You might want to show an alert or handle the error in some way
                    return;
                }

                // Handle the success case here, e.g., show a success message or navigate to a new screen
                console.log('Loan request successful!');
                setShowSuccessMsg(true);
                setSliderValue(0);
                const dummydata = {
                    amountRequested: 40000,
                    status: 'زیر التواء',
                    date: '10 جنوری 2024',
                    purpose: 'Karobar'
                }
                setLoanRequest(dummydata);
                setLoanRequestExists(true);     // just for demo
                setTimeout(() => {
                    setShowSuccessMsg(false);
                }, 5000); // 5000 milliseconds = 5 seconds
                // fetchExistingLoanRequest(userToken);    // to refresh page with submitted loan request details
            } catch (error) {
                console.error('Error requesting a loan:', error.message);
            }
        }
    };

    const handleCancel = async () => {
        try {
            console.log(loanRequest)
            const response = await fetch(`${url}/user/cancelLoanRequest`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ loanReq: loanRequest, cnic: loggedInCnic }),
            });

            if (!response.ok) {
                console.error('Failed to cancel the loan request:', response.status, response.statusText);
                setShowErrorMsg2(true);
                setTimeout(() => {
                    setShowErrorMsg2(false);
                }, 5000);
                return;
            }

            // Handle the success case here, e.g., show a success message or navigate to a new screen
            console.log('Loan cancellation successful!');
            setShowSuccessMsg2(true);
            setLoanRequestExists(false);    // just for demo without db
            setSliderValue(0)
            setTimeout(() => {
                setShowSuccessMsg2(false);
            }, 5000);
        } catch (error) {
            console.error('Error canceling the loan request:', error.message);
            setShowErrorMsg2(true);
            setTimeout(() => {
                setShowErrorMsg2(false);
            }, 5000); // 5000 milliseconds = 5 seconds
        }
    };

    return (
        <>
            <Navbar navigation={navigation} />

            <View style={styles.container}>
                <View style={styles.titleView}>
                    <TouchableOpacity onPress={handleLoanReqSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.title}>قرض کی درخواست</Text>
                </View>
                <View style={styles.horizontalLine} />

                {loanRequestExists ?
                    <>
                        {showSuccessMsg && (
                            <Text style={styles.successText}>قرض کی درخواست درج ہو گئی ہے۔</Text>
                        )}
                        {showSuccessMsg2 && (
                            <Text style={styles.successText}>قرض کی درخواست واپس لے لی گئی ہے۔</Text>
                        )}
                        <View style={styles.headingTwo}>
                            <Text style={styles.headingTextTwo}>درخواست کی رقم</Text>
                            <View style={styles.headingThree}>
                                <TouchableOpacity onPress={handleAmountSpeakerClick}>
                                    <Icon name="volume-up" size={30} color="black" />
                                </TouchableOpacity>
                                <Text style={styles.greenText}>Rs. {loanRequest.amountRequested}</Text>
                            </View>
                            <Text style={styles.headingTextTwo}>درخواست کا مقصد</Text>
                            <View style={styles.headingThree}>
                                <TouchableOpacity onPress={handlePurposeSpeakerClick}>
                                    <Icon name="volume-up" size={30} color="black" />
                                </TouchableOpacity>
                                <Text style={styles.greenText}>{loanRequest.purpose}</Text>
                            </View>
                            <Text style={styles.headingTextTwo}>سٹیٹس</Text>
                            <View style={styles.headingThree}>
                                <TouchableOpacity onPress={handleStatusSpeakerClick}>
                                    <Icon name="volume-up" size={30} color="black" />
                                </TouchableOpacity>
                                <Text style={styles.urduGreenText}>{loanRequest.status}</Text>
                            </View>
                            <Text style={styles.headingTextTwo}>درخواست کی تاریخ</Text>
                            <View style={styles.headingThree}>
                                <TouchableOpacity onPress={handleDateSpeakerClick}>
                                    <Icon name="volume-up" size={30} color="black" />
                                </TouchableOpacity>
                                <Text style={styles.urduGreenText}>{loanRequest.date}</Text>
                            </View>
                        </View>
                        {showErrorMsg2 && (
                            <Text style={styles.errorText}>قرض کی درخواست منسوخ کرنے میں ناکامی. دوبارہ کوشش کریں۔</Text>
                        )}
                        <TouchableOpacity style={styles.button} onPress={handleCancel}>
                            <TouchableOpacity onPress={handleCancelSpeakerClick}>
                                <Icon name="volume-up" size={30} color="black" />
                            </TouchableOpacity>
                            <Text style={styles.buttonText}>
                                درخواست واپس لیں
                            </Text>
                        </TouchableOpacity>
                    </>
                    :
                    <>
                        {showSuccessMsg && (
                            <Text style={styles.successText}>قرض کی درخواست درج ہو گئی ہے۔</Text>
                        )}
                        {showSuccessMsg2 && (
                            <Text style={styles.successText}>قرض کی درخواست واپس لے لی گئی ہے۔</Text>
                        )}
                        <View style={styles.heading}>
                            <TouchableOpacity onPress={handleEnterAmountSpeakerClick}>
                                <Icon name="volume-up" size={30} color="black" />
                            </TouchableOpacity>
                            <Text style={styles.headingText}>قرض کی رقم درج کریں</Text>
                        </View>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={100000}
                            step={1000}
                            value={sliderValue}
                            minimumTrackTintColor="#cb847c"
                            maximumTrackTintColor="#A9A9A9"
                            thumbTintColor="#9e1911"
                            onValueChange={handleSliderChange}
                        />
                        <Text style={styles.sliderValue}>Rs. {sliderValue}</Text>
                        {showErrorMsg && (
                            <Text style={styles.errorText}>براہ کرم صفر سے زیادہ رقم درج کریں۔</Text>
                        )}
                        <View style={styles.inputGroup}>
                            <TouchableOpacity onPress={handleEnterPurposeSpeakerClick}>
                                <Icon name="volume-up" size={30} color="black" />
                            </TouchableOpacity>
                            <Picker
                                style={styles.inputField}
                                selectedValue={purpose}
                                onValueChange={(itemValue, itemIndex) => setPurpose(itemValue)}
                            >
                                <Picker.Item label="ایک آپشن منتخب کریں" value="" />
                                <Picker.Item label="کشف کاروبار قرضہ" value="کشف کاروبار قرضہ" />
                                <Picker.Item label="کشف اسکول سرمایہ" value="کشف اسکول سرمایہ" />
                                <Picker.Item label="کشف آسان لون" value="کشف آسان لون" />
                                <Picker.Item label="کشف مویشی قرضہ" value="کشف مویشی قرضہ" />
                                <Picker.Item label="کشف مرحبا پروڈکٹ" value="کشف مرحبا پروڈکٹ" />
                                <Picker.Item label="کشف سہولت قرضہ" value="کشف سہولت قرضہ" />
                                <Picker.Item label="کشف مویشی مرابحہ" value="کشف مویشی مرابحہ" />
                                <Picker.Item label="کشف ٹاپ اپ لون" value="کشف ٹاپ اپ لون" />
                                <Picker.Item label="ہوم امپروومنٹ لون" value="ہوم امپروومنٹ لون" />
                            </Picker>
                        </View>
                        {showErrorMsg3 && (
                        <Text style={styles.errorText}>آپ کو ایک مقصد منتخب کرنا ہوگا۔</Text>
                    )}
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <TouchableOpacity onPress={handleSubmitSpeakerClick}>
                                <Icon name="volume-up" size={30} color="black" />
                            </TouchableOpacity>
                            <Text style={styles.buttonText}>
                                درخواست کریں
                            </Text>
                        </TouchableOpacity>
                    </>

                }

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
    title: {
        color: '#9e1911',
        fontSize: 34,
        fontWeight: 'bold',
        textAlign: 'right',
        marginLeft: 10,
        marginTop: -15
    },
    heading: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '25%'
    },
    headingTwo: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '3%'
    },
    headingThree: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headingText: {
        marginLeft: 10,
        fontSize: 20,
        marginTop: -15
    },
    headingTextTwo: {
        marginLeft: 10,
        fontSize: 20,
        marginTop: 15
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
    slider: {
        width: '100%',
        height: 40,
        borderRadius: 20,
        marginTop: 10,
    },
    sliderValue: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#9e1911',
        marginTop: 20,
        marginBottom: 30,
        textAlign: 'center'
    },
    greenText: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#9e1911',
        marginLeft: 10,
        textAlign: 'center'
    },
    urduGreenText: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#9e1911',
        marginLeft: 10,
        marginTop: -20,
        textAlign: 'center'
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
        marginTop: 30
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
    inputField: {
        borderWidth: 0,
        backgroundColor: '#f1f1d6',
        borderRadius: 8,
        marginLeft: 10,
        width: '100%',
        textAlign: 'left',
        flex: 1,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
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

export default LoanRequest;
