import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from './firebase'; // Asegúrate de importar la configuración de tu firebase.js
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Screen1 from './Screen1';
import Screen2 from './Screen2';
import Screen3 from './Screen3';

const HomeScreen = () => {
  const [usuario, setUsuario] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('Screen1');

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        const auth = getAuth(app);
        const db = getFirestore(app);

        const unsubscribe = onAuthStateChanged(auth, async user => {
          if (user) {
            const userId = user.uid;
            const userRef = doc(db, 'usuarios', userId);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();
              setUsuario(userData);
              console.log('Datos del usuario:', userData);
            } else {
              console.log('No se encontraron datos para el usuario con el userId:', userId);
            }
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error al obtener los datos del usuario', error.message);
      }
    };

    obtenerDatosUsuario();
  }, []);

  const handleScreenChange = (screenName) => {
    setCurrentScreen(screenName);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Screen1':
        return <Screen1 />;
      case 'Screen2':
        return <Screen2 usuario={usuario} />;
      case 'Screen3':
        return <Screen3 usuario={usuario} />;
      default:
        return <Screen1 />;
    }
  };

  const isActive = (screenName) => {
    return currentScreen === screenName ? styles.activeText : {};
  };

  return (
    <View style={styles.container}>
      <View style={styles.topButtons}>
        <TouchableOpacity onPress={() => handleScreenChange('Screen1')} style={styles.button}>
          <Text style={[styles.buttonText, isActive('Screen1')]}>Oficial</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleScreenChange('Screen2')} style={styles.button}>
          <Text style={[styles.buttonText, isActive('Screen2')]}>Comunidad</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleScreenChange('Screen3')} style={styles.button}>
          <Text style={[styles.buttonText, isActive('Screen3')]}>Foro</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {renderScreen()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor:"white",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    top:40,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
  },
  activeText: {
    color: '#007BFF',
    borderColor: '#007BFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
