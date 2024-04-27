// App.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Provider } from 'react-redux'

import { store } from './app/store';

import TaskList from './components/TaskList';
import Chat from './components/Chat';
import Profile from './components/Contacts';
import Login from './components/login/Login';
import MainPage from './components/MainPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    console.log('handleLogin')
    // Здесь должен быть ваш код для отправки запроса на сервер для авторизации
    // В случае успешной авторизации установите isLoggedIn в true
    setIsLoggedIn(true);
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      return <Login onLogin={handleLogin} />;
    }
    switch (activeTab) {
      case 'main':
        return <MainPage setIsLoggedIn={setIsLoggedIn}/>;
      case 'tasks':
        return <TaskList setIsLoggedIn={setIsLoggedIn}/>;
      case 'chat':
        return <Chat setIsLoggedIn={setIsLoggedIn}/>;
      case 'contacts':
        return <Profile />;
      default:
        return null;
    }
  };

  return (
    <Provider store={store}>
      <View style={styles.container}>
        <View style={styles.content}>{renderContent()}</View>
        {isLoggedIn && (
          <View style={styles.menu}>
            <TouchableOpacity onPress={() => setActiveTab('main')}>
              <Text style={styles.menuItem}>Главная</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('tasks')}>
              <Text style={styles.menuItem}>Задачи</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('chat')}>
              <Text style={styles.menuItem}>Чат</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('contacts')}>
              <Text style={styles.menuItem}>Контакты</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  content: {
    width: '100%',
    height: '92%',
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '8%',
    backgroundColor: '#B6BBC4',
  },
  menuItem: {
    color: 'white',
    fontSize: 16,
  },
});
