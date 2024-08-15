import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Navbar from '../../components/Navbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Audio } from 'expo-av';

const LoanRequestsMainPage = ({ navigation }) => {
	const [sound, setSound] = React.useState(null);

    async function handleLoanReqSpeakerClick() {
		console.log('Loading Sound');
		const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/loanreqmainpage.mp3')
		);
		setSound(sound);

		console.log('Playing Sound');
		await sound.playAsync();
	}

    async function handleNewLoanReqSpeakerClick() {
		console.log('Loading Sound');
		const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/newloanreq.mp3')
		);
		setSound(sound);

		console.log('Playing Sound');
		await sound.playAsync();
	}

	async function handleLoanReqHistorySpeakerClick() {
		console.log('Loading Sound');
		const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/loanreqhistory.mp3')
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

    const handleNewLoanReqPress = () => {
        setSound(null);
        navigation.navigate('NewLoanRequest')
    };

    const handleLoanReqHistoryPress = () => {
        setSound(null);
        navigation.navigate('LoanRequestHistory')
    };

    return (
        <>
            <Navbar navigation={navigation}/>

            <View style={styles.container}>
                <View style={styles.titleView}>
                    <TouchableOpacity onPress={handleLoanReqSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.title}>قرض کی درخواست</Text>
                </View>
                <View style={styles.horizontalLine} />

                <View style={styles.rectangleContainer}>
                    <TouchableOpacity style={styles.rectangle} onPress={handleNewLoanReqPress}>
                        <Text style={styles.rectangleTitle}>نئی/موجودہ درخواست</Text>
                        <TouchableOpacity onPress={handleNewLoanReqSpeakerClick}>
                            <Icon name="volume-up" size={30} color="black" />
                        </TouchableOpacity>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.rectangle} onPress={handleLoanReqHistoryPress}>
                        <Text style={styles.rectangleTitle}>پچھلی درخواست</Text>
                        <TouchableOpacity onPress={handleLoanReqHistorySpeakerClick}>
                            <Icon name="volume-up" size={30} color="black" />
                        </TouchableOpacity>
                    </TouchableOpacity>
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
    rectangleContainer: {
        marginTop: '25%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rectangle: {
        backgroundColor: '#f1f1d6',
		borderRadius: 20,
		padding: 10,
		alignItems: 'center',
		width: 350,
		height: 150,
		margin: 30
    },
    rectangleTitle: {
        color: '#9e1911',
        fontSize: 38,
        fontWeight: 'bold',
    },
});


export default LoanRequestsMainPage;
