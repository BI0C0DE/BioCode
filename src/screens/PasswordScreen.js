// PasswordScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { auth, firestore } from './firebase'; // Importa auth y firestore desde tu firebase.js
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

const PasswordScreen = ({ navigation, route }) => {
  const { email } = route.params;
  const [password, setPassword] = useState('');

  const handleCreateAccount = async () => {
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Cuenta creada para:', user.email);

      const username = generateUsername();

      const userRef = doc(firestore, 'usuarios', user.uid);
      await setDoc(userRef, {
        rol: 'Miembro', 

        email: user.email,
        userUid: user.uid,
        fotoPerfil: null, 
        nombreUsuario: username,
      });

      navigation.navigate('Home', { userUid: user.uid });
    } catch (error) {
      console.error('Error al crear cuenta:', error);
      Alert.alert('Error', 'No se pudo crear la cuenta. Por favor intenta de nuevo más tarde.');
    }
  };

  const generateUsername = () => {
    const randomNum = Math.floor(Math.random() * 100000000);
    return `Aqua${randomNum}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>AquaConnect</Text>
      <Text style={styles.promptText}>Ingresa una contraseña</Text>
      <Text style={styles.hintText}>Usa más de 6 caracteres</Text>
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
        style={styles.input}
        backgroundColor="white"
      />
      <Button
        mode="contained"
        onPress={handleCreateAccount}
        style={styles.button}
        buttonColor="#000"
      >
        Crear Cuenta
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
  hintText: {
    fontSize: 14,
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

export default PasswordScreen;
