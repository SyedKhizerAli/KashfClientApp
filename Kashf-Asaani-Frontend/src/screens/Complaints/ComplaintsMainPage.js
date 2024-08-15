import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Navbar from '../../components/Navbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Audio } from 'expo-av';

const ComplaintsMainPage = ({ navigation }) => {
	const [sound, setSound] = React.useState(null);

    async function handleComplaintsSpeakerClick() {
		console.log('Loading Sound');
		const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/complaintsscreen.mp3')
		);
		setSound(sound);

		console.log('Playing Sound');
		await sound.playAsync();
	}

    async function handleNewComplaintSpeakerClick() {
		console.log('Loading Sound');
		const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/newcomplaint.mp3')
		);
		setSound(sound);

		console.log('Playing Sound');
		await sound.playAsync();
	}

	async function handleComplaintHistorySpeakerClick() {
		console.log('Loading Sound');
		const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/complaintshistory.mp3')
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

    const handleNewComplaintPress = () => {
        setSound(null);
        navigation.navigate('NewComplaint')
    };

    const handleComplaintHistoryPress = () => {
        setSound(null);
        navigation.navigate('ComplaintsHistory')
    };

    return (
        <>
            <Navbar navigation={navigation}/>

            <View style={styles.container}>
                <View style={styles.titleView}>
                    <TouchableOpacity onPress={handleComplaintsSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.title}>شکایات</Text>
                </View>
                <View style={styles.horizontalLine} />

                <View style={styles.rectangleContainer}>
                    <TouchableOpacity style={styles.rectangle} onPress={handleNewComplaintPress}>
                        <Text style={styles.rectangleTitle}>نئی شکایت</Text>
                        <TouchableOpacity onPress={handleNewComplaintSpeakerClick}>
                            <Icon name="volume-up" size={30} color="black" />
                        </TouchableOpacity>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.rectangle} onPress={handleComplaintHistoryPress}>
                        <Text style={styles.rectangleTitle}>پچھلی شکایات</Text>
                        <TouchableOpacity onPress={handleComplaintHistorySpeakerClick}>
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


export default ComplaintsMainPage;
