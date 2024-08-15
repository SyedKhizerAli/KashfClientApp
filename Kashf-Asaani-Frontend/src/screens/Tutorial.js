import React, { useContext } from 'react';
import { View, Button, StyleSheet, ScrollView } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const Tutorial = ({ navigation }) => {

    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    return (
        <View style={styles.container}>
            <View style={styles.videoContainer}>
                <Video
                    ref={video}
                    style={styles.video}
                    source={require('./../../assets/videos/tutorial.mp4')}
                    useNativeControls
                    resizeMode="cover"
                    isLooping='false'
                    onPlaybackStatusUpdate={(status) => setStatus(() => status)}
                />
            </View>
            <View style={styles.buttons}>
                <Button
                    title={status.isPlaying ? 'Pause' : 'Play'}
                    onPress={() =>
                        status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                    }
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fcfcf0', // Light green background
        padding: 20,
    },
    videoContainer: {
        borderRadius: 10, 
        overflow: 'hidden', 
        // elevation: 5, // Android shadow
        // shadowColor: '#000', // iOS shadow
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.3,
        // shadowRadius: 3.84,
        borderWidth: 1, // Border width
        borderColor: '#ddd', // Light grey border color
        height: '90%',
    },
    video: {
        width: '100%',
        height: '90%', // Set the height as needed
    },
    buttons: {
        marginTop: 20,
    },
});

export default Tutorial;
