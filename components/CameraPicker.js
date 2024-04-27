import React, { useState } from 'react';
import { View, Button, Platform, Alert, StyleSheet, Pressable, Text, Modal, Image, TextInput } from 'react-native';
import { Camera } from 'expo-camera';
import { Fontisto } from '@expo/vector-icons';
import { addFileMessage } from './chatApi';

export default function CameraPicker() {
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [message, setMessage] = useState('');

    const takePicture = async () => {
        if (!cameraRef) return;

        try {
            const { uri } = await cameraRef.takePictureAsync();
            setSelectedFile({ uri });
            setModalVisible(true);
        } catch (error) {
            console.error('Failed to take picture:', error);
        }
    };

    const hideModal = () => {
        setModalVisible(false);
    };

    const sendMessage = () => {
        addFileMessage(
            {
                uri: selectedFile.uri,
                name: 'photo.jpg',
                type: 'image/jpeg', // Укажите тип файла, если он известен
                userId: 1,
                toId: 2,
                text: message
            },
            (data) => {
                console.log('Data file:', data);
            }
        );
        console.log('Отправить сообщение:', message);
        hideModal();
    };

    return (
        <View>
            <Pressable onPress={takePicture}>
                <View style={styles.btn_icon}>
                    <Fontisto name="camera" size={24} color="white" />
                </View>
            </Pressable>

            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={hideModal}
            >
                <View style={styles.modalContainer}>
                    <Button title="Закрыть" onPress={hideModal} />
                    {selectedFile && (
                        <View style={{ width: '50%', height: '50%' }}>
                            <Image source={{ uri: selectedFile.uri }} style={styles.image} />
                        </View>
                    )}

                    <TextInput
                        style={styles.input}
                        placeholder="Введите сообщение"
                        onChangeText={text => setMessage(text)}
                        value={message}
                    />
                    <Button title="Отправить" onPress={sendMessage} />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    btn_icon: {
        width: 40,
        alignItems: 'center'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
        borderWidth: 1
    }
});
