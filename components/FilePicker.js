import React, { useState } from 'react';
import { View, Button, Platform, Alert, StyleSheet, Pressable, Text, Modal, Image, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Fontisto } from '@expo/vector-icons';
import { addFileMessage } from './chatApi';

export default function FilePicker() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [message, setMessage] = useState('');

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            console.log('result img', result);
            if (!result.canceled) {
                setSelectedFile(result);
                setModalVisible(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const pickDocument = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({
                type: '*/*'
            });
            console.log('result', result)
            if (!result.canceled) {
                setSelectedFile(result);
                setModalVisible(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const hideModal = () => {
        setModalVisible(false);
    };

    const sendMessage = () => {
        // Отправить сообщение с выбранным файлом и текстом
        addFileMessage(
            {
                uri: selectedFile?.assets[0].uri, 
                name: 'd.jpeg' ,//selectedFile?.assets[0].name, 
                type: selectedFile?.assets[0].mimeType,
                userId: 1,
                toId: 2,
                text: message
            }, (data) => {
                console.log('data file', data)
            })
        console.log('Отправить сообщение:', message);
        hideModal();
    };

    return (
        <View>
            <Pressable onPress={() => {
                Alert.alert(
                    'Выбор файла',
                    'Выберите изображение или файл документа',
                    [
                        { text: 'Выбрать изображение', onPress: pickImage },
                        { text: 'Выбрать файл', onPress: pickDocument },
                        { text: 'Отмена', style: 'cancel' },
                    ],
                    { cancelable: true }
                );
            }}>
                <View style={styles.btn_icon}>
                    <Fontisto name="paperclip" size={24} color="white" />
                </View>
            </Pressable>

            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    hideModal();
                }}
            >
                <View style={styles.modalContainer}>
                    <Button title="Закрыть" onPress={hideModal} />
                    {/* <Text>{selectedFile?.assets[0].name}</Text> */}
                    {selectedFile?.assets[0] && selectedFile?.assets[0].uri && (
                        <View style={{ width: '50%', height: '50%' }}>
                            {selectedFile?.assets[0].uri.endsWith('.jpg') || selectedFile?.assets[0].uri.endsWith('.png') || selectedFile?.assets[0].uri.endsWith('.jpeg') ? (
                                <Image source={{ uri: selectedFile?.assets[0].uri }} style={styles.image} />
                            ) : (
                                <View>
                                    <Text>{selectedFile?.assets[0].name}</Text>
                                    {/* Здесь можете добавить компоненты для ввода и кнопку отправить */}
                                </View>
                            )}
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
