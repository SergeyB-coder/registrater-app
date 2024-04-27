//TaskList.js
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import Checkbox from 'expo-checkbox';
import { getTasks, createTask, updateTask } from './taskApi';
import { MaterialIcons, Fontisto } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectName, selectUserId, selectUsers, setIsLogOut, setName, setUserId } from './login/loginSlice';


import DateTimePicker from '@react-native-community/datetimepicker';

const TaskList = ({ setIsLoggedIn }) => {
    const isIOS = Platform.OS === 'ios';

    const dispatch = useDispatch()
    const [tasks, setTasks] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [newTaskText, setNewTaskText] = useState('');
    const user_id = useSelector(selectUserId)
    const username = useSelector(selectName)
    const users = useSelector(selectUsers)

    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [isChecked, setChecked] = useState(false);

    const [selectedTask, setSelectedTask] = useState(null);


    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleTaskPress = (selectedTask) => {
        setSelectedTask(selectedTask); // Устанавливаем выбранную задачу в состояние

        setNewTaskText(selectedTask.text); // Устанавливаем текст задачи
        setDate(new Date(selectedTask.timeout)); // Устанавливаем таймаут задачи
        setChecked(selectedTask.urgency === 1); // Устанавливаем срочность задачи


        setModalVisible(true); // Открываем модальное окно
    };


    const handleCreateTask = () => {
        createTask(user_id, newTaskText, {
            timeout: date,
            urgency: isChecked ? 1 : 0
        }, data => {
            console.log('createTask', data)
            setTasks([...tasks, data]);
            setNewTaskText('');
            toggleModal();
        });
    };

    const handleUpdateTask = () => {
        if (!selectedTask) {
            return; // Если задача не выбрана, ничего не делаем
        }

        updateTask(selectedTask.id, newTaskText, {
            timeout: date,
            urgency: isChecked ? 1 : 0
        }, data => {
            console.log('updateTask', data);
            // Обновляем состояние задач в списке
            setTasks(tasks.map(task => task.id === selectedTask.id ? data : task));
            setNewTaskText('');
            toggleModal();
        });
    };

    const handleLogOut = () => {
        setIsLoggedIn(false)
        dispatch(setIsLogOut(true))
    }

    const handleClickUser = (user) => {
        console.log('handleClickUser', user)
        getTasks(user.user_id)
            .then(data => {
                // console.log(data)
                setTasks(data);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
            });
        dispatch(setName(user.company_name))
        dispatch(setUserId(user.user_id))
    }

    useEffect(() => {
        getTasks(user_id)
            .then(data => {
                console.log(data)
                setTasks(data);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
            });
    }, [user_id]);

    return (
        <View style={styles.container}>

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

            <Text style={styles.header}>Список задач:</Text>

            <FlatList
                data={tasks}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={{zIndex: 0}} onPress={() => handleTaskPress(item)}>
                        <View style={styles.task}>
                            <Text style={styles.taskDateTime}>{item.datetime.slice(0, 10)} {item.datetime.slice(11, 16)}</Text>
                            <Text style={styles.taskText}>{item.text}</Text>
                            <View style={styles.taskDetails}>
                                <View>
                                    <Text style={styles.taskDetail}>
                                        Таймаут:
                                    </Text>
                                    <Text style={styles.taskDetail}>
                                        {item.timeout.slice(0, 10)} {item.timeout.slice(11, 16)}
                                    </Text>
                                </View>
                                {item.urgency === 1 && !item.finish_date && (
                                    <Text style={[ styles.taskDetail, { color: 'red' } ]}>Срочно</Text>
                                )}
                                {item.finish_date && (
                                    <Text style={ styles.taskDetail }>Исполнено { item.finish_date.slice(0, 10) }</Text>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />

            <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
                <MaterialIcons name="add-task" size={24} color="white" />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={toggleModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                            {/* <Text style={styles.buttonText}>Закрыть</Text> */}
                            <Fontisto name="close" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Введите текст задачи:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Текст задачи"
                            onChangeText={text => setNewTaskText(text)}
                            value={newTaskText}
                        />
                        {show && !isIOS && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={mode}
                                is24Hour={true}
                                onChange={onChange}
                            />
                        )}
                        {!isIOS &&
                            <View style={styles.dateDetails}>
                                <Text>
                                    Таймаут:
                                </Text>
                                <TouchableOpacity style={styles.dateButton} onPress={showDatepicker}>
                                    <Text style={{ color: '#31304D' }}>{date.toLocaleString().slice(0, 10)}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.dateButton} onPress={showTimepicker}>
                                    <Text style={{ color: '#31304D' }}>{date.toLocaleString().slice(12, 17)}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        {isIOS &&
                            <View style={styles.dateDetails}>
                                <Text>
                                    Таймаут:
                                </Text>
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode={'date'}
                                    is24Hour={true}
                                    onChange={onChange}
                                />
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode={'time'}
                                    is24Hour={true}
                                    onChange={onChange}
                                />
                            </View>
                        }
                        {/* Добавлен чекбокс для определения срочности */}
                        <View style={styles.checkboxContainer}>
                            <Text style={styles.checkboxLabel}>Срочно</Text>
                            <Checkbox
                                style={styles.checkbox}
                                value={isChecked}
                                onValueChange={setChecked}
                                color={isChecked ? '#4630EB' : undefined}
                            />
                        </View>
                        {/* <TouchableOpacity style={styles.createButton} onPress={handleCreateTask}>
                            <Text style={styles.buttonText}>Создать</Text>
                        </TouchableOpacity> */}
                        {selectedTask ? (
                            <TouchableOpacity style={styles.createButton} onPress={handleUpdateTask}>
                                <Text style={styles.buttonText}>Сохранить</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.createButton} onPress={handleCreateTask}>
                                <Text style={styles.buttonText}>Создать</Text>
                            </TouchableOpacity>
                        )}

                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    listUsers: {
        position: 'absolute',
        top: 20,
        right: 0,
        backgroundColor: '#F0ECE5',
        padding: 5,
        borderRadius: 5,
        zIndex: 25
    },
    container: {
        width: '100%',
        height: '100%',
        paddingTop: 80,
    },
    header: {
        fontSize: 24,
        color: '#0052aa',
        marginBottom: 15,
        marginLeft: 15,
    },
    task: {
        backgroundColor: '#cddce3',
        borderRadius: 10,
        marginHorizontal: 15,
        marginBottom: 15,
        padding: 15,
        color: '#FFF'
    },
    taskText: {
        color: '#161A30',
        fontWeight: '600',
        fontSize: 18
    },
    taskDateTime: {
        color: '#0052aa',
        fontWeight: '400',
        fontSize: 14,
        textAlign: 'right'
    },
    taskDetail: {
        color: '#161A30',
        fontStyle: 'italic'
    },
    taskDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dateDetails: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#B6BBC4',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#F0ECE5',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#B6BBC4',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        borderColor: '#B6BBC4',
        borderWidth: 1
    },
    modalTitle: {
        fontSize: 18,
        color: 'white', // Цвет текста
    },
    input: {
        height: 40,
        borderColor: '#B6BBC4', // Цвет бордера
        borderWidth: 1,
        marginBottom: 10,
        marginTop: 10,
        paddingHorizontal: 10,
        width: '100%', // Изменено
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Прозрачный фон
        borderRadius: 5,
        color: '#31304D'
    },
    createButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Прозрачный фон
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        borderColor: '#B6BBC4', // Цвет бордера
        borderWidth: 1,
        color: '#31304D'
    },
    dateButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Прозрачный фон
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        borderColor: '#B6BBC4', // Цвет бордера
        borderWidth: 1,
        color: '#B6BBC4'
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#B6BBC4', // Прозрачный фон
        padding: 10,
        borderRadius: 5,
        borderColor: '#B6BBC4', // Цвет бордера
        borderWidth: 1,
    },
    buttonText: {
        color: '#31304D', // Цвет текста
    },
    checkboxContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: 10
    }
});

export default TaskList;


// #0052aa  синий
// #cddce3 light blue
// #fc8227  оранжевый
// rgba(228, 228, 228, 1)  серый
// #777  темно-серый  (текст)
// текст белый на синем, синий на оранжевом, на кнопках белый на оранж