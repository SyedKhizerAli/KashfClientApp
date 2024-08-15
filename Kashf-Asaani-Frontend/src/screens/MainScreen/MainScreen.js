import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Audio } from 'expo-av';

const MainScreen = ({ navigation }) => {
	const [sound, setSound] = React.useState(null);

	async function handleLoginSpeakerClick() {
		console.log('Loading Sound');
		const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/login.mp3')
		);
		setSound(sound);

		console.log('Playing Sound');
		await sound.playAsync();
	}

	async function handleSignupSpeakerClick() {
		console.log('Loading Sound');
		const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/signup.mp3')
		);
		setSound(sound);

		console.log('Playing Sound');
		await sound.playAsync();
	}

	async function handleTutorialSpeakerClick() {
		console.log('Loading Sound');
		const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/tutorial.mp3')
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
		const setAudioMode = async () => {
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: false,
			});
		};

		setAudioMode();
	}, []);

	const handleLoginPress = () => {
		setSound(null);
		navigation.navigate('Login');
	};

	const handleSignupPress = () => {
		setSound(null);
		navigation.navigate('Signup');
	};

	const handleTutorialPress = () => {
		setSound(null);
		navigation.navigate('Tutorial');
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Image source={require('./../../../assets/images/kashf-logo.png')} style={styles.headerImage} />
				<Text style={styles.headerText}>کشف آسانی میں خوش آمدید</Text>
				<Text style={styles.belowHeaderText}>براہ کرم ایک اختیار منتخب کریں</Text>
			</View>

			<View style={styles.row}>
				<TouchableOpacity style={styles.block} onPress={handleLoginPress}>
					<Text style={styles.whiteBlockText}>لاگ ان</Text>
					<Image source={require('./../../../assets/images/login.png')} style={styles.blockImage} />
					<TouchableOpacity onPress={handleLoginSpeakerClick}>
						<Icon name="volume-up" size={30} color="black" />
					</TouchableOpacity>
				</TouchableOpacity>

				<TouchableOpacity style={styles.block} onPress={handleSignupPress}>
					<Text style={styles.whiteBlockText}>سائن اپ</Text>
					<Image source={require('./../../../assets/images/signup.png')} style={styles.blockImage} />
					<TouchableOpacity onPress={handleSignupSpeakerClick}>
						<Icon name="volume-up" size={30} color="black" />
					</TouchableOpacity>
				</TouchableOpacity>
			</View>

			<View>
				<TouchableOpacity style={styles.greenBlock} onPress={handleTutorialPress}>
					<Text style={styles.greenBlockText}>استعمال کا طریقہ</Text>
					<Image source={require('./../../../assets/images/tutorial.png')} style={styles.blockImage} />
					<TouchableOpacity onPress={handleTutorialSpeakerClick}>
						<Icon name="volume-up" size={30} color="black" />
					</TouchableOpacity>
				</TouchableOpacity>
			</View>
		</View>
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
	row: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 20,
	},
	block: {
		backgroundColor: '#f1f1d6',
		borderRadius: 10,
		padding: 10,
		alignItems: 'center',
		width: 170,
		height: 170,
		margin: 10
	},
	whiteBlockText: {
		fontSize: 16,
		color: '#9e1911',
		fontWeight: 'bold',
	},
	blockImage: {
		width: 110,
		height: 80,
		resizeMode: 'contain',
		marginTop: 10,
	},
	greenBlock: {
		backgroundColor: '#cb847c',
		borderRadius: 10,
		padding: 10,
		alignItems: 'center',
		width: 170,
		height: 170,
		margin: 10
	},
	greenBlockText: {
		fontSize: 18,
		color: 'white',
		fontWeight: 'bold',
	},
});

export default MainScreen;
