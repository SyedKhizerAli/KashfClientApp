import React, {useEffect, useContext} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Navbar from '../../components/Navbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Audio } from 'expo-av';
import Constants from "expo-constants";
import { AuthContext } from '../../context/AuthContext';
const BACKEND_URL = Constants.expoConfig?.env.BACKEND_URL;

const LoanHistory = ({ navigation }) => {
	const [sound, setSound] = React.useState(null);
    const [historyData, setHistoryData] = React.useState(null);

    const {userToken, loggedInCnic} = useContext(AuthContext)

    useEffect(() => {
        // Fetch loan history data from the backend when the component mounts
        fetchLoanHistory(userToken);
    }, []);

    const fetchLoanHistory = async (userToken) => {
        try {
            const url = BACKEND_URL;       
            const response = await fetch(`${url}/user/loanHistory?cnic=${loggedInCnic}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Failed to fetch loan history:', response.status, response.statusText);
                // You might want to show an alert or handle the error in some way
                return;
            }

            const data = await response.json();
            setHistoryData(data.history);
        } catch (error) {
            console.error('Error fetching loan history:', error.message);
            // You might want to show an alert or handle the error in some way
        }
    };

    async function handleSpeakerClick() {
		console.log('Loading Sound');
		const { sound } = await Audio.Sound.createAsync(require('./../../../assets/audios/loanhistoryscreen.mp3')
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
                <Text style={styles.cell}>{item.type}</Text>
                <Text style={styles.cell}>{item.number}</Text>
            </View>
        );
    };

    return (
        <>
            <Navbar navigation={navigation}/>

            <View style={styles.container}>
                <View style={styles.titleView}>
                    <TouchableOpacity onPress={handleSpeakerClick}>
                        <Icon name="volume-up" size={30} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.title}>پچھلے قرضے</Text>
                </View>
                <View style={styles.horizontalLine} />

                {/* Table Header */}
                <View style={[styles.row, styles.headerRow]}>
                    <Text style={styles.headerCell}>سٹیٹس</Text>
                    <Text style={styles.headerCell}>قرض کی رقم</Text>
                    <Text style={styles.headerCell}>قرض نمبر</Text>
                </View>

                {/* Table Data */}
                <FlatList
                    data={historyData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderRow}
                />
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderBottomColor: '#cb847c',
        borderBottomWidth: 1,
    },
    headerRow: {
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
});

export default LoanHistory;
