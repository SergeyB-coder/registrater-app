import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Contacts = () => {
  return (
    <View>
      <Text style={{fontFamily: 'Lobster-Regular', color: 'rgba(0, 114, 188, 0.8)', fontSize: 18, textAlign: 'center', marginBottom: 30}}>Регистратор</Text>
      <View>
        <Text style={styles.heading}>Адрес офиса:</Text>
        <Text style={styles.text}>г. Санкт-Петербург, ул. Новгородская, 23</Text>

        <Text style={styles.heading}>Единый контактный телефон:</Text>
        <Text style={styles.text}>8 (812) 331-46-92</Text>
        <Text style={styles.text}>8 (800) 101-74-34</Text>

        <Text style={styles.heading}>Режим работы офиса:</Text>
        <Text style={styles.text}>с 9-00 до 21-00</Text>
        <Text style={styles.text}>без перерывов, без выходных</Text>

        <Text style={styles.heading}>Электронная почта:</Text>
        <Text style={styles.text}>info@registratorspb.ru</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  text: {
    fontSize: 16,
    marginBottom: 3,
    color: '#666',
  },
});

export default Contacts;
