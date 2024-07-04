import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { app } from './firebase'; 
const Screen1 = ({ usuario }) => {
  const [publicaciones, setPublicaciones] = useState([]);

  useEffect(() => {
    const db = getFirestore(app);
    const publicacionesRef = collection(db, 'publicacionesAdministrador');

    const unsubscribe = onSnapshot(publicacionesRef, (snapshot) => {
      const publicacionesArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPublicaciones(publicacionesArray);
    });

    return () => unsubscribe();
  }, []);

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
        top:20,

        padding: 10,
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

export default Screen1;
