import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from './firebase'; // Importa la configuración de tu firebase.js

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Usuario inició sesión:', user.email);
        navigation.navigate('Home');
      })
      .catch(error => {
        console.error('Error al iniciar sesión:', error);
        Alert.alert('Error', 'Credenciales incorrectas. Por favor intenta de nuevo.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>AquaConnect</Text>
      <Text style={styles.promptText}>Ingresa tus credenciales</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        style={styles.input}
        keyboardType="email-address"
        backgroundColor="white"

      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={text => setPassword(text)}
        style={styles.input}
        secureTextEntry
        backgroundColor="white"

      />
      <Button
        mode="contained"
        onPress={handleSignIn}
        style={styles.button}
        buttonColor='#2d40af'
      >
        Iniciar Sesión
      </Button>
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
  promptText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;
