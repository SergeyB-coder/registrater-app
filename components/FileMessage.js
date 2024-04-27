import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Linking, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const url = process.env.EXPO_PUBLIC_SOCKET_URL

const FileMessage = ({ path }) => {
    const [playing, setPlaying] = useState(false)

    async function handlePlayAudio(uri) {
        if (!playing) {
            setPlaying(true)
            const { sound } = await Audio.Sound.createAsync({ uri: `${url}/${uri}` }, { shouldPlay: true });
            // setSound(sound);

            sound.setOnPlaybackStatusUpdate(status => {
                if (status.didJustFinish) {
                    console.log('Audio playback finished');
                    setPlaying(false);
                }
            });

            console.log('Playing Sound');

            await sound.playAsync()


                .then(() => { console.log(999) });
            // await sound.unloadAsync();
            // setPlaying(false)
            // setPlayingAudio(-1)
        }
    }

    const handleDownload = () => {
        Linking.openURL(`${url}/${path}`);
    };

    const isWav = path.endsWith('.wav')
    const isImage = ['.png', '.jpg', '.jpeg', '.bmp', '.gif', '.tiff'].some(ext => path.endsWith(ext))

    return (
        <View>
            {isWav &&
                <View style={styles.cntr_audio_msg}>
                    <Text style={{ flex: 5 }}>AUDIO</Text>
                    <Pressable onPress={() => { handlePlayAudio(path) }} style={{ flex: 1 }}>
                        {playing ?
                            <MaterialIcons name="multitrack-audio" size={24} color="black" /> :
                            <Ionicons name="play-outline" size={24} color="black" />
                        }
                    </Pressable>
                </View>
            }
            {isImage && 
                <View style={styles.photo_container}>
                    <Image
                        source={{ uri: `${url}/${path}` }}
                        style={{ width: 100, height: 100, borderRadius: 10 }}
                    />
                </View>
            }
            <TouchableOpacity onPress={handleDownload}>
                <Text style={styles.file_name}>{'Скачать'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    cntr_audio_msg: {
        flexDirection: 'row'
    }
});

export default FileMessage;
