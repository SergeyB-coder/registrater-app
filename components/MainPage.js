import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsLogOut, selectUserId, selectUsers, setName, setUserId, setUsers } from './login/loginSlice'
import { getUserData } from './login/loginApi'; // предположим, что здесь находится ваш файл с функцией getUserData

const MainPage = ({ setIsLoggedIn }) => {
    const url = process.env.EXPO_PUBLIC_SOCKET_URL
    const [user, setUser] = useState(null);
    const username = useSelector(state => state.username); // предположим, что здесь находится имя пользователя из Redux хранилища
    const dispatch = useDispatch();
    const user_id = useSelector(selectUserId)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUserData(user_id); // вызов функции getUserData для получения данных о пользователе
                setUser(userData.user[0]); // предполагается, что данные приходят в виде { user: { ... } }
            } catch (error) {
                console.error('Ошибка при загрузке данных о пользователе:', error);
            }
        };

        if (username !== '') {
            fetchData();
        }
    }, [username]);

    const handleLogOut = () => {
        dispatch(setName(''));
    };

    const renderUserInfo = () => {
        if (user) {
            return (
                <View style={{ padding: 10 }}>
                    <Text>Название компании: {user.name}</Text>
                    <Text>Email: {user.email}</Text>
                    <Text>Телефон: {user.phone}</Text>
                    <Text>INN: {user.inn}</Text>
                    <Text>CEO: {user.ceo}</Text>
                    <Text>Налогообложение: {user.tax}</Text>
                </View>
            );
        } else {
            return (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>Загрузка данных...</Text>
            );
        }
    };

    const renderAccountant = () => {
        if (user) {
            return (
                <View style={{ padding: 10, width: '80%' }}>
                    <Text>Имя: {user.acc_name}</Text>
                    <Text>Телефон: {user.acc_phone}</Text>
                </View>
            );
        } else {
            return (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>Загрузка данных...</Text>
            );
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '80%' }}>
            <View>
                <TouchableOpacity onPress={() => dispatch(setName(''))}>
                    <Text style={{ color: '#777', fontSize: 10, textAlign: 'right' }}>{username}</Text>
                </TouchableOpacity>
                {username === '' && (
                    <View style={{ backgroundColor: '#f0f0f0', padding: 10, marginTop: 10 }}>
                        <Text>Список пользователей:</Text>
                        {/* Предположим, что у вас есть массив пользователей из Redux хранилища */}
                        <View>
                            {/* Предположим, что у каждого пользователя есть поле company_name */}
                            {users.map((user, index) => (
                                <TouchableOpacity key={index} onPress={() => dispatch(setName(user.name))}>
                                    <Text style={{ marginTop: 5 }}>{user.company_name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity onPress={handleLogOut} style={{ backgroundColor: 'grey', marginTop: 10, padding: 5 }}>
                            <Text style={{ color: 'white', textAlign: 'center' }}>Выйти</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <Text style={{ fontSize: 20, marginTop: 20 }}>Информация о компании</Text>
            {renderUserInfo()}
            <Text style={{ fontSize: 20, marginTop: 20 }}>Бухгалтер</Text>
            {renderAccountant()}
            <View style={styles.photo_container}>
                {   user &&
                    <Image
                        source={{ uri: `${url}/${user.acc_path}` }}
                        style={{ width: 100, height: 100, borderRadius: 10 }}
                    />
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    photo_container: {
        with: '100%'
    }
});

export default MainPage;
