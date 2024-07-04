// RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleRegister = () => {
    if (!email) {
      Alert.alert('Email vacío', 'Por favor ingresa un correo electrónico válido.');
      return;
    }

    
    navigation.navigate('Password', { email });
  };
  const handleLogin = () => {
   
    

   
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>AquaConnect</Text>
      <Text style={styles.createAccountText}>Crea una cuenta</Text>
      <Text style={styles.emailPrompt}>Ingresa tu email</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        style={styles.input}
        backgroundColor="white"
      />
      <Button
        mode="contained"
        onPress={handleRegister}
        style={styles.button}
        buttonColor='#2d40af'
      >
        Registrate con email
      </Button>
      <Text style={styles.emailPrompt2}>o inicia sesión</Text>
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button2}
        buttonColor='gray'
      >
        Iniciar Sesión
      </Button>
      <Text style={styles.termsText}>
        Al hacer click en Continuar aceptas tu compromiso por cuidar el agua
      </Text>
      <Text style={styles.termsText2}>
        Y los términos y condiciones
      </Text>
      <Image source={require('./logo.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  createAccountText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  emailPrompt: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  emailPrompt2: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    color: 'gray',
    top:10,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
  },
  button2: {
    marginTop: 10,
    borderRadius: 10,
  },
  termsText: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  termsText2: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default RegisterScreen;
