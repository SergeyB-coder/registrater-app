// Button1.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';


const Button1 = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.btn_send} onPress={onPress}>
      <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn_send: {
    backgroundColor: '#F0ECE5', // Измените этот цвет на желаемый
    padding: 10,
    borderRadius: 5,
  },
  btnText: {
    color: 'white', // Цвет текста кнопки
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Button1;

// #B6BBC4
// #161A30
// #31304D
// #F0ECE5
