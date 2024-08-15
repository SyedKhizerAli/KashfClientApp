import React, { useState, useEffect, useContext, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, Image, SectionList } from 'react-native';
import Navbar from '../components/Navbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Audio } from 'expo-av';
import Constants from "expo-constants";
import { AuthContext } from '../context/AuthContext';
const BACKEND_URL = Constants.expoConfig?.env.BACKEND_URL;

const Dashboard = ({ navigation }) => {
    const [sound, setSound] = React.useState(null);
    const [currentLoanDetails, setCurrentLoanDetails] = useState(null);
    const [currentInstallmentDetails, setCurrentInstallmentDetails] = useState(null);
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const { userToken, loggedInCnic } = useContext(AuthContext)

    useEffect(() => {
        // Fetch current loan details from the backend when the component mounts
        fetchCurrentLoanDetails(userToken);
    }, []); // Empty dependency array ensures this effect runs only once when the component mounts

    const fetchCurrentLoanDetails = async (userToken) => {
        try {
            const url = BACKEND_URL;
            const response = await fetch(`${url}/user/getcurentLoanDetails?cnic=${loggedInCnic}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Failed to fetch current loan details:', response.status, response.statusText);
                return;
            }

            const data = await response.json();
            // Set the fetched current loan details to state
            setCurrentLoanDetails(data.loandetails);
            setCurrentInstallmentDetails(data.installmentDetails);
            calculateTimeRemaining();
        } catch (error) {
            console.error('Error fetching current loan details:', error.message);
        }
    };

    async function handleDashboardSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/dashboard.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handleLoanHistorySpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/loanhistory.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handleComplaintsSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/complaints.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handleTutorialSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/tutorial.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handleTotalRemainingSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/totalremaining.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handleInstallmentRemainingSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/installmentremaining.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handleDueDateSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/duedate.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handleTimerSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/timer.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handlePrevInstallmentSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/previnstallment.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handlePromoSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/promo.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handleLoanRequestSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/loanrequest.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function handleChangeNumSpeakerClick() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audios/changephone.mp3')
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

    const handleSpeakerClick = () => {
        // Handle speaker icon click logic here
        console.log('Speaker icon clicked!');
    };

    const calculateTimeRemaining = () => {
        // Replace this with your actual due date
        const dueDate = new Date('2024-06-31T00:00:00Z');

        const now = new Date();
        const timeDifference = dueDate - now;

        if (timeDifference > 0) {
            const _days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const _hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const _minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const _seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            setDays(_days);
            setHours(_hours);
            setMinutes(_minutes);
            setSeconds(_seconds);

            // return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
        // else {
        // return 'Expired';
        // }
    };

    // const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

    const renderRow = ({ item, index }) => {
        let statusColor;

        switch (item.status) {
            case 'رقم ادا ہو گئی':
                statusColor = '#4fc470';
                break;
            case 'باقی':
                statusColor = 'red';
                break;
            default:
                statusColor = 'black'; // Default color if status doesn't match any case
        };

        return (
            <View style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
                <Text style={[styles.cell, { color: statusColor }]}>{item.status}</Text>
                <Text style={[styles.cell, { color: statusColor }]}>{item.date}</Text>
                <Text style={styles.cell}>{item.type}</Text>
                <Text style={styles.cell}>{item.number}</Text>
            </View>
        );
    };

    const handleLoanHistoryPress = () => {
        setSound(null);
        navigation.navigate('LoanHistory');
    };

    const handleComplaintsPress = () => {
        setSound(null);
        navigation.navigate('Complaints');
    };

    const handleLoanRequestPress = () => {
        setSound(null);
        navigation.navigate('LoanRequest');
    };

    const handleChangeNumPress = () => {
        setSound(null);
        navigation.navigate('ChangePhoneNumber');
    };

    const handleFacialRecogPress = () => {
        console.log('FacialRecog');
        setSound(null);
        navigation.navigate('Chatbot2');
    };

    const handleChatbotPress = () => {
        console.log('Chatbot');
    };

    const handleTutorialPress = () => {
        setSound(null);
        navigation.navigate('Tutorial');
    };

    useEffect(() => {
        const interval = setInterval(() => {
            calculateTimeRemaining();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const getHeader = () => {
        return <>
            <View style={styles.titleView}>
                <TouchableOpacity onPress={handleDashboardSpeakerClick}>
                    <Icon name="volume-up" size={30} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>قرض کی تفصیلات </Text>
            </View>
            <View style={styles.horizontalLine} />

            <View style={styles.headingTwo}>
                <Text style={styles.infoText}>زینب رضا</Text>
                <Text style={styles.infoText}>برانچ: لاہور (جوہر ٹاؤن)</Text>
                <Text style={styles.infoText}> پتہ: 1 سی شاہراہ نظریہ پاکستان، بلاک کے فیز 2 جوہر ٹاؤن</Text>

                <Text style={styles.headingTextTwo}>  قرض کی باقی رقم</Text>
                <View style={styles.headingThree}>
                    <TouchableOpacity onPress={handleTotalRemainingSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.greenText}>Rs. {currentInstallmentDetails && currentInstallmentDetails.totalAmountDue ? currentInstallmentDetails.totalAmountDue : 'N/A'}</Text>
                </View>
                {/* <Text style={styles.headingTextTwo}>موجودہ قسط کی باقی رقم</Text>
                <View style={styles.headingThree}>
                    <TouchableOpacity onPress={handleInstallmentRemainingSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.greenText}>Rs. {currentInstallmentDetails && currentInstallmentDetails.currentInstallmentAmountDue ? currentInstallmentDetails.currentInstallmentAmountDue : 'N/A'}</Text>
                </View>
                <Text style={styles.headingTextTwo}>قسط نمبر <Text style={styles.smolGreenText}>{currentInstallmentDetails && currentInstallmentDetails.installmentNumber ? currentInstallmentDetails.installmentNumber : 'N/A'}</Text></Text> */}
                <Text style={styles.headingTextTwo}>جمع کرانے کی آخری تاریخ</Text>
                <View style={styles.headingThree}>
                    <TouchableOpacity onPress={handleDueDateSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.urduGreenText}>{currentInstallmentDetails && currentInstallmentDetails.dueDate ? currentInstallmentDetails.dueDate : 'N/A'}</Text>
                </View>
                <Text style={styles.headingTextTwo}>بقیہ وقت</Text>
                <View style={styles.headingThree}>
                    <TouchableOpacity onPress={handleTimerSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                    <View style={styles.headingTextTwo}>
                        <Text style={styles.greenText}>{days} : {hours} : {minutes} : {seconds}</Text>
                        <Text style={styles.timerText}>سیکنڈ          منٹ          گھنٹے           دن</Text>
                    </View>
                </View>
                {/* <Text style={styles.headingTextTwo}>پچھلی قسط</Text>
                <View style={styles.headingThree}>
                    <TouchableOpacity onPress={handlePrevInstallmentSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.actualgreenText}>Rs. {currentInstallmentDetails && currentInstallmentDetails.previousInstallmentAmountDue ? currentInstallmentDetails.previousInstallmentAmountDue : 'N/A'}</Text>
                </View> */}
            </View>

            {/* Table Header */}
            <View style={[styles.tablerow, styles.headerRow]}>
                <Text style={styles.headerCell}>سٹیٹس</Text>
                <Text style={styles.headerCell}>آخری تاریخ</Text>
                <Text style={styles.headerCell}> رقم</Text>
                <Text style={styles.headerCell}>قسط نمبر</Text>
            </View>
        </>
    };

    const getFooter = useMemo(() => {
        return <>
            <View style={styles.row}>
                <TouchableOpacity style={styles.block} onPress={handleLoanHistoryPress}>
                    <Text style={styles.whiteBlockText}>پرانے قرضے</Text>
                    <Image source={require('./../../assets/images/loanhistory.png')} style={styles.blockImage} />
                    <TouchableOpacity onPress={handleLoanHistorySpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                </TouchableOpacity>

                <TouchableOpacity style={styles.block} onPress={handleComplaintsPress}>
                    <Text style={styles.whiteBlockText}>شکایات</Text>
                    <Image source={require('./../../assets/images/complaints.png')} style={styles.blockImage} />
                    <TouchableOpacity onPress={handleComplaintsSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                <TouchableOpacity style={styles.block} onPress={handleTutorialPress}>
                    <Text style={styles.whiteBlockText}>استعمال کا طریقہ</Text>
                    <Image source={require('./../../assets/images/tutorial.png')} style={styles.blockImage} />
                    <TouchableOpacity onPress={handleTutorialSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                </TouchableOpacity>

                <TouchableOpacity style={styles.block} onPress={handleLoanRequestPress}>
                    <Text style={styles.whiteBlockText}>قرض کی درخواست</Text>
                    <Image source={require('./../../assets/images/loanrequest.png')} style={styles.blockImage} />
                    <TouchableOpacity onPress={handleLoanRequestSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>

            <View style={styles.lastrow}>

                <TouchableOpacity style={styles.block} onPress={handleChangeNumPress}>
                    <Text style={styles.whiteBlockText}>اپنا فون نمبر تبدیل کریں</Text>
                    <Image source={require('./../../assets/images/changenum.png')} style={styles.blockImage} />
                    <TouchableOpacity onPress={handleChangeNumSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                </TouchableOpacity>
                <TouchableOpacity style={styles.block} onPress={handleFacialRecogPress}>
                    <Text style={styles.whiteBlockText}>مدد کے لیے سوالات پوچھیں</Text>
                    <Image source={require('./../../assets/images/chatbot.png')} style={styles.blockImage} />
                    <TouchableOpacity onPress={handleSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
        </>
    }, []);

    return (
        <>

            <Navbar navigation={navigation} />

            {/* Table Data */}
            <FlatList
                data={currentLoanDetails}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderRow}
                ListHeaderComponent={getHeader}
                ListFooterComponent={getFooter}
                style={styles.container}
            />

            <View style={styles.promotionalmsg}>
                <Image source={require('./../../assets/images/promotionalpic.png')} style={styles.promoImage} />
                <TouchableOpacity onPress={handlePromoSpeakerClick}>
                    <Icon name="volume-up" size={30} color="black" />
                </TouchableOpacity>
                <Text style={styles.whiteText}>کشف ہنر کاری لون: زندگی کو بہتر بنائیں!
                    آپ کی راہیں آسان، خوابوں کو حقیقت بنائیں۔</Text>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fcfcf0', // Light green background
        padding: 20,
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
    headingTwo: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '5%'
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
    infoText: {
        fontSize: 20,
        marginBottom: -15,
        fontWeight: "bold",
        color: '#9e1911'
    },
    greenText: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#9e1911',//'#9e1911',
        marginLeft: 10,
        textAlign: 'center'
    },
    actualgreenText: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#9e1911',
        marginLeft: 10,
        textAlign: 'center'
    },
    timerText: {
        fontSize: 22,
        // fontWeight: 'bold',
        color: '#9e1911',
        marginLeft: 10,
        textAlign: 'center'
    },
    smolGreenText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#9e1911',
        textAlign: 'center'
    },
    urduGreenText: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#9e1911',//'#9e1911',
        marginLeft: 10,
        marginTop: -20,
        textAlign: 'center'
    },
    tablerow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderBottomColor: '#B8C1CC',
        borderBottomWidth: 1,
    },
    headerRow: {
        marginTop: 50,
        backgroundColor: '#cb847c', // Header row color
    },
    evenRow: {
        backgroundColor: '#f1f1d6', // Even row color
    },
    oddRow: {
        backgroundColor: '#fcfcf0', // Odd row color
    },
    cell: {
        flex: 1,
        textAlign: 'center',
    },
    headerCell: {
        flex: 1,
        textAlign: 'center',
        color: 'white', // Header text color
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    lastrow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        paddingBottom: 250
    },
    block: {
        backgroundColor: '#f1f1d6',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        width: 170,
        height: 170,
        margin: 10,
    },
    whiteBlockText: {
        fontSize: 16,
        color: '#9e1911',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    blockImage: {
        width: 110,
        height: 80,
        resizeMode: 'contain',
        marginTop: 10,
    },
    promoImage: {
        flex: 1,
        resizeMode: 'contain',
        margin: 10,
        borderRadius: 10, // Add a border radius for a more attractive appearance
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.35,
        shadowRadius: 6.84,
        // elevation: 5,
    },
    promotionalmsg: {
        width: 380,
        height: 200,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5DB075',
        position: 'absolute',
        top: '78%', // Adjust this value based on your needs
        left: '47%',
        marginLeft: -175, // Half of the width
        marginTop: -25, // Half of the height
        borderRadius: 10,
    },
    whiteText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        paddingLeft: 10,
        flex: 1,
        margin: 10,
    },
});


export default Dashboard;
