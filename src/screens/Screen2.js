import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Button, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { app } from './firebase'; 
const Screen2 = ({ usuario }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [publicaciones, setPublicaciones] = useState([]);

  useEffect(() => {
    const db = getFirestore(app);
    const publicacionesRef = collection(db, 'publicaciones');

    const unsubscribe = onSnapshot(publicacionesRef, (snapshot) => {
      const publicacionesArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPublicaciones(publicacionesArray);
    });

    return () => unsubscribe();
  }, []);

  const handlePublish = async () => {
    if (titulo.trim() === '' || descripcion.trim() === '') {
      return; 
    }

    const db = getFirestore(app);

    const newPost = {
      nombreUsuario: usuario.nombreUsuario,
      userUid: usuario.userUid,
      titulo,
      descripcion,
      fotoPerfil: usuario.fotoPerfil,
      rol: usuario.rol,
      likes: 0,
      comentarios: [],
      timestamp: serverTimestamp(),
    };

    try {
      if (usuario.rol === 'Administrador') {
        await addDoc(collection(db, 'publicacionesAdministrador'), newPost);
      } else {
        await addDoc(collection(db, 'publicaciones'), newPost);
      }

      setTitulo('');
      setDescripcion('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error al publicar:', error);
    }
  };

  const handleLike = async (id) => {
    const db = getFirestore(app);
    const publicacionRef = collection(db, 'publicaciones').doc(id);

    try {
      await publicacionRef.update({
        likes: serverTimestamp.increment(1),
      });
    } catch (error) {
      console.error('Error al actualizar likes:', error);
    }
  };

  const renderPublicacion = ({ item }) => (
    <View style={styles.publicacionContainer}>
      <Image source={{ uri: item.fotoPerfil }} style={styles.publicacionAvatar} />
      <View style={styles.publicacionContent}>
        <Text style={styles.publicacionUser}>{item.nombreUsuario}</Text>
        <Text style={styles.publicacionTitulo}>{item.titulo}</Text>
        <Text style={styles.publicacionDescripcion}>{item.descripcion}</Text>
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.iconContainer} onPress={() => handleLike(item.id)}>
            <Ionicons name="heart-outline" size={20} color="red" />
            <Text style={styles.iconText}>{item.likes} Likes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer}>
            <Ionicons name="chatbubble-outline" size={20} color="blue" />
            <Text style={styles.iconText}>{item.comentarios.length} Comentarios</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={publicaciones}
        renderItem={renderPublicacion}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.publicacionesList}
      />
      {usuario.rol === 'Administrador' && (
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Título"
              maxLength={20}
              value={titulo}
              onChangeText={setTitulo}
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              maxLength={100}
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
            />
            <Button title="Publicar" onPress={handlePublish} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      text: {
        fontSize: 20,
        marginBottom: 10,
      },
      fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#007BFF',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 10,
      },
      input: {
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
      },
      publicacionesList: {
        padding: 10,
        top:20,
      },
      publicacionContainer: {
        width: '100%',
    
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
      },
      publicacionAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
      },
      publicacionContent: {
      },
      publicacionUser: {
        fontSize: 12,
        color: '#666',
      },
      publicacionTitulo: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      publicacionDescripcion: {
        fontSize: 14,
      },
  footerContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  iconText: {
    marginLeft: 5,
  },
});

export default Screen2;
