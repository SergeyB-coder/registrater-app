import React, { useEffect, useState } from 'react';
import { View, TextInput, Image, StyleSheet, Pressable, Text, Alert } from 'react-native';
import { loginUser } from './loginApi';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';

import { selectIsLogOut, selectUsers, setName, setUserId, setUsers } from './loginSlice'

const Login = ({ onLogin }) => {
    let [fontsLoaded] = useFonts({
        'Lobster-Regular': require('../../assets/fonts/Lobster-Regular.ttf'),
      });

    

    const dispatch = useDispatch()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const users = useSelector(selectUsers)
    const is_logout = useSelector(selectIsLogOut)

    const handleLogin = () => {
        loginUser(username, password)
            .then(data => {
                console.log('res login', data)
                if (data.error) Alert.alert('Ошибка', 'Неверные данные')
                else {


                    dispatch(setName(data.name))
                    dispatch(setUserId(data.id))
                    // Обработка успешного входа, например, вызов функции onLogin с данными пользователя
                    onLogin(data);
                    const newUser = { username, password, company_name: data.name, user_id: data.id };

                    const existingUserIndex = users.findIndex(user => user.username === newUser.username);
                    if (existingUserIndex === -1) {
                        // Добавляем нового пользователя, если его еще нет в списке
                        const updatedUsers = [...users, newUser];
                        AsyncStorage.setItem('userList', JSON.stringify(updatedUsers));
                        dispatch(setUsers(updatedUsers));
                    } else {
                        // Обновляем существующего пользователя
                        const updatedUsers = [...users];
                        updatedUsers[existingUserIndex] = newUser;
                        AsyncStorage.setItem('userList', JSON.stringify(updatedUsers));
                        dispatch(setUsers(updatedUsers));
                    }
                }

            })
            .catch(error => {
                // Обработка ошибки, например, вывод сообщения об ошибке
                console.error('Ошибка при входе:', error);
            });
    };


    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('userList');
                console.log('userData', userData)
                if (userData) {
                    const parsedUserData = JSON.parse(userData);
                    console.log('parsedUserData', parsedUserData)
                    dispatch(setUsers(parsedUserData));
                    // Если в хранилище есть данные о пользователе, попытаемся автоматически войти
                    if (parsedUserData.length > 0) {
                        const lastUser = parsedUserData[parsedUserData.length - 1];
                        loginUser(lastUser.username, lastUser.password)
                            .then(data => {
                                if (!data.error) {
                                    console.log('data.name', data.name)
                                    const newUser = { username: lastUser.username, password: lastUser.password, company_name: data.name, user_id: data.id };
                                    const updatedUsers = [...parsedUserData];
                                    updatedUsers[parsedUserData.length - 1] = newUser;
                                    AsyncStorage.setItem('userList', JSON.stringify(updatedUsers));

                                    dispatch(setUsers(updatedUsers));
                                    dispatch(setName(data.name));
                                    dispatch(setUserId(data.id));
                                    onLogin(data);
                                }
                            })
                            .catch(error => {
                                console.error('Ошибка при автоматической авторизации:', error);
                            });
                    }
                }
            } catch (error) {
                console.error('Failed to load user data:', error);
            }
        };

        if (!is_logout) loadUserData();
    }, []);

    if (!fontsLoaded) return null
    else {
    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 90}}>
                <Image style={{width: 50, height: 50}} source={require('../../assets/icon.png')}/>
                <Text style={{fontFamily: 'Lobster-Regular', color: 'rgba(0, 114, 188, 0.8)', fontSize: 18}}>егистратор</Text>
            </View>
            
            <Text style={{color: 'rgba(0, 114, 188, 0.8)'}}>Вход</Text>
            <TextInput
                style={styles.input}
                placeholder="Логин"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Пароль"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Pressable style={styles.btn_login} onPress={handleLogin}>
                <Text style={styles.btn_login_txt}>Войти</Text>
            </Pressable>
        </View>
    );
    }
};

const styles = StyleSheet.create({
    container: {
        width: '60%',
        // height: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    input: {
        // flex: 1,
        height: 40,
        width: '70%',
        backgroundColor: 'white',
        borderRadius: 5,
        paddingHorizontal: 10,
        borderColor: 'rgba(228, 228, 228, 1)',
        borderWidth: 1,
        color: '#777'
    },
    btn_login: {
        height: 40,
        width: '70%',
        backgroundColor: '#777',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',

    },
    btn_login_txt: {

        color: '#fff',
        fontSize: 16
    }
});

export default Login;
