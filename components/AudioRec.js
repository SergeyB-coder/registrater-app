import * as React from 'react';
import { Text, View, StyleSheet, Button, Pressable } from 'react-native';
import { Audio } from 'expo-av';

import { Ionicons, FontAwesome  } from '@expo/vector-icons';


export default function AudioRec(props) {
    const handleSaveAudio = props.handleSaveAudio
    const [recording, setRecording] = React.useState();

    async function startRecording() {
        try {
        console.log('Requesting permissions..');
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });

        console.log('Starting recording..');
        const { recording } = await Audio.Recording.createAsync( 
            {
                ...Audio.RecordingOptionsPresets.LOW_QUALITY ,
                android: {
                    extension: '.wav',
                    // outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_WAV,
                    // audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_PCM,
                    sampleRate: 44100,
                    numberOfChannels: 1,
                    bitRate: 128000,
                },
                ios: {
                    extension: '.wav',
                    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
                    sampleRate: 44100,
                    numberOfChannels: 1,
                    bitRate: 128000,
                    linearPCMBitDepth: 16,
                    linearPCMIsBigEndian: false,
                    linearPCMIsFloat: false,
                },
            }
        );
        setRecording(recording);
        console.log('Recording started');
        } catch (err) {
        console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        });
        const uri = recording.getURI();
        handleSaveAudio(uri)
        // console.log('Recording stopped and stored at', uri);
    }

    return (
        <View>
            {/* <Button
                title={recording ? 'Stop Recording' : 'Start Recording'}
                onPress={recording ? stopRecording : startRecording}
            /> */}
            <Pressable onPress={recording ? stopRecording : startRecording}>
                
                {   recording ?
                    <Ionicons name="stop-circle-outline" size={24} color="white" />:
                    <FontAwesome name="microphone" size={24} color="white" />
                }
                
            </Pressable>
        </View>
    );
}