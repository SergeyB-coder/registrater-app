import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, Image, Dimensions } from 'react-native';
import { useSocket } from './useSocket';
import io from 'socket.io-client';
import Button1 from './Button1';
import { FontAwesome, Fontisto } from '@expo/vector-icons';
import { Camera } from 'expo-camera'
import { addAudioOrder, addFileMessage, getMessages } from './chatApi';
import FileMessage from './FileMessage';
import AudioRec from './AudioRec';
import FilePicker from './FilePicker';
import { useDispatch, useSelector } from 'react-redux';
import { selectName, selectUserId, setName, selectUsers, setUserId, setIsLogOut } from './login/loginSlice';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const socket = io.connect('https://testapi.na4u.ru', {
    transports: ['websocket'],
    reconnectionAttempts: 15
});

const Chat = ({ setIsLoggedIn }) => {
    const camera = useRef(null)
    const flatListRef = useRef(null);
    const dispatch = useDispatch()

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [startCamera, setStartCamera] = useState(false);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [selectedFile, setSelectedFile] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [message, setMessage] = useState('');

    const username = useSelector(selectName)
    const user_id = useSelector(selectUserId)
    const users = useSelector(selectUsers)

    

    const handleSocket = (data) => {
        // Обновляем список сообщений при получении нового
        setMessages((prevMessages) => [...prevMessages, data]);
        scrollToBottom()
    };

    const scrollToBottom = () => {
        console.log('scroll')
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    };

    const hideModal = () => {
        setModalVisible(false);
    };

    const sendMessage = () => {
        socket.emit('sendMessage', { text: newMessage, from_id: user_id, to_id: 2 });
        setNewMessage('');
        console.log('sendmesg')
    };

    const sendMessageCamera = () => {
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

    const handleSaveAudio = (uri) => {
        console.log('uri', uri)
        addAudioOrder({ audio: uri }, (data) => {
            console.log('data audio', data)
            // handleGetOrderAudio()
        })
    }

    const fetchMessagesFromServer = async (id) => {
        try {
            console.log('fetchMessagesFromServer')

            // Используйте вашу функцию getMessages для запроса сообщений
            const data = await getMessages(id || user_id);
            console.log('fetchMessagesFromServer', data)
            // Обновляем состояние сообщений с сервера
            setMessages(data.messages);

            setTimeout(scrollToBottom, 1000);
        } catch (error) {
            console.error('Ошибка при загрузке сообщений:', error);
        }
    };

    const startCameraHandler = async () => {
        
        // Запрос разрешений на использование камеры
        await Camera.requestCameraPermissionsAsync();
        // Если разрешения получены, устанавливаем флаг для запуска камеры
        if (permission.granted || permission) {
            setStartCamera(true);
        } else {
            Alert.alert('Доступ запрещен');
        }
    };

    const takePictureHandler = async () => {
        // Код для снятия фотографии
        // setStartCamera(false); // Закрыть камеру
        const photo = await camera.current.takePictureAsync({ quality: 0.1 });
        setStartCamera(false); // Закрыть камеру после снятия фотографии
        // Здесь можно добавить дальнейшую обработку снимка
        console.log('photo', photo)
        setSelectedFile(photo);
        setModalVisible(true);
    };

    const handleLogOut = () => {
        setIsLoggedIn(false)
        dispatch(setIsLogOut(true))
    }

    const handleClickUser = (user) => {
        console.log('handleClickUser', user)
        dispatch(setUserId(user.user_id))
        fetchMessagesFromServer(user.user_id)
        dispatch(setName(user.company_name))
    }

    // useLayoutEffect(() => {
    //     scrollToBottom();
    //   }, [messages]);

    useEffect(() => {
        fetchMessagesFromServer()
    }, []);

    useEffect(() => {
        // Подписываемся на событие нового сообщения
        socket.on('newMessage', handleSocket);

        return () => {
            // Отписываемся от события при размонтировании компонента
            socket.removeAllListeners('newMessage');
        };
    }, []);

    return (
        <View style={styles.container_chat}>

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
                    {selectedFile?.uri && (
                        <View style={{ width: '50%', height: '50%' }}>
                            {selectedFile.uri.endsWith('.jpg') || selectedFile.uri.endsWith('.png') || selectedFile.uri.endsWith('.jpeg') ? (
                                <Image source={{ uri: selectedFile.uri }} style={styles.image} />
                            ) : (
                                <View>
                                    <Text>{selectedFile.uri}</Text>
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
                    <Button title="Отправить" onPress={sendMessageCamera} />


                </View>
            </Modal>


            <View style={{ position: 'relative', zIndex: 10}}>
                <TouchableOpacity onPress={() => dispatch(setName(''))}>
                    <Text style={{ color: '#777', fontSize: 10, textAlign: 'right' }}>{username}</Text>
                </TouchableOpacity>
                {
                    username === '' &&
                    <>
                        <View style={styles.listUsers}>
                            <View>
                                {users.map((user, index) => (
                                    <TouchableOpacity style={{ borderBottomWidth: 1, padding: 2 }} key={index} onPress={() => handleClickUser(user)}>
                                        <Text style={{ color: 'black', fontSize: 14, textAlign: 'right' }}>{user.company_name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <TouchableOpacity style={{ backgroundColor: 'grey', borderRadius: 5, marginTop: 3, padding: 2 }} onPress={handleLogOut}>
                                <Text style={{ textAlign: 'center' }}>
                                    Выйти
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                }
            </View>
            <Text style={styles.title_chat}>Чат</Text>
            <FlatList
                ref={flatListRef}
                style={styles.list_chat}
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={item.from_id === user_id ? styles.ownMessage : styles.otherMessage}>
                        {item.path && <FileMessage path={item.path} />}
                        <Text style={{ color: 'white', fontSize: 17 }}>{item.text}</Text>
                        <Text style={{ color: 'green', fontSize: 9 }}>{item.datetime.split('T')[0]} {item.datetime.split('T')[1].slice(0, 5)}</Text>
                    </View>
                )}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Введите сообщение"
                    value={newMessage}
                    onChangeText={(text) => setNewMessage(text)}
                />
                <FilePicker />
                <View style={styles.btn_icon}>
                    <AudioRec handleSaveAudio={handleSaveAudio} />
                </View>
                {newMessage ? (
                    <TouchableOpacity style={styles.btn_icon} onPress={sendMessage}>
                        <FontAwesome name="send" size={24} color="white" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.btn_icon} onPress={startCameraHandler}>
                        <FontAwesome name="camera" size={24} color="white" />
                    </TouchableOpacity>
                )}
            </View>

            {startCamera &&
            <View style={{ position: 'absolute', height: screenHeight, width: screenWidth}}>
                <Camera
                    style={{ flex: 1, width: "100%" }}
                    ref={camera}
                >
                    <View style={{ position: 'absolute', width: '100%', height: 300, bottom: 40 }}>
                        <TouchableOpacity style={{ width: 50, height: 50, borderRadius: 15, opacity: 0.5, backgroundColor: 'white', alignSelf: 'center' }}
                            onPress={takePictureHandler}
                        >

                        </TouchableOpacity>
                    </View>

                    <View style={{ position: 'absolute', width: '100%', height: 30, top: 40 }}>
                        <TouchableOpacity style={{ alignSelf: 'center' }}
                            onPress={() => setStartCamera(false)}
                        >
                            <Text style={{ color: '#FFFFFF' }}>Закрыть</Text>
                        </TouchableOpacity>
                    </View>


                </Camera>
            </View>}
        </View>
    );
};

const styles = StyleSheet.create({
    btn_icon: {
        width: 40,
        alignItems: 'center'
    },
    list_chat: {
        marginTop: 5,
        borderRadius: 5,
        backgroundColor: '#161A30',
        padding: 5,
        marginBottom: 5
    },
    container_chat: {
        flex: 1,
        backgroundColor: '#31304D',
        padding: 10,
        marginTop: 50
    },
    ownMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#B6BBC4',
        borderRadius: 10,
        marginVertical: 5,
        padding: 10,
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#B6BBC4',
        borderRadius: 10,
        marginVertical: 5,
        padding: 10,
    },
    title_chat: {
        color: 'white',
        alignSelf: 'center'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        marginRight: 10,
        paddingHorizontal: 10,
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
    },
    listUsers: {
        position: 'absolute',
        top: 20,
        right: 0,
        backgroundColor: '#F0ECE5',
        padding: 5,
        borderRadius: 5,
        zIndex: 25
    },
});

export default Chat;

// #B6BBC4
// #161A30
// #31304D
// #F0ECE5
