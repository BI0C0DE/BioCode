import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ref, push, serverTimestamp, onValue } from 'firebase/database';
import { auth, realtimeDB, db } from './firebase'; 
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const ForoScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, 'usuarios', user.uid);
      getDoc(userRef).then((userSnapshot) => {
        if (userSnapshot.exists()) {
          setUsuario({ ...userSnapshot.data(), userUid: user.uid });
        } else {
          console.log('No se encontraron datos para el usuario con el userUid:', user.uid);
        }
      }).catch((error) => {
        console.error('Error al obtener los datos del usuario', error.message);
      });
    }
  }, []);

  useEffect(() => {
    const messagesRef = ref(realtimeDB, 'mensajes');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messagesArray = snapshot.val() ? Object.values(snapshot.val()) : [];
      setMessages(messagesArray);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSend = async () => {
    if (inputMessage.trim() === '' || !usuario) {
      return;
    }

    const newMessage = {
      userUid: usuario.userUid,
      nombreUsuario: usuario.nombreUsuario,
      mensaje: inputMessage.trim(),
      fotoPerfil: usuario.fotoPerfil,
      timestamp: serverTimestamp(),
    };

    try {
      await push(ref(realtimeDB, 'mensajes'), newMessage);
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = (message) => {
    const isMine = message.userUid === (usuario && usuario.userUid);
    const messageStyle = isMine ? styles.myMessage : styles.otherMessage;
    const messageTextStyle = isMine ? styles.myMessageText : styles.otherMessageText;

    return (
      <View key={message.timestamp} style={[styles.message, messageStyle]}>
        <Image source={{ uri: message.fotoPerfil }} style={styles.messageAvatar} />
        <View style={styles.messageContent}>
          <Text style={messageTextStyle}>{message.mensaje}</Text>
          <Text style={styles.messageUser}>{message.nombreUsuario}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('./logo.png')} style={styles.logo} />
        <Text style={styles.headerText}>Foro Oficial AquaConnect</Text>
      </View>
      <ScrollView contentContainerStyle={styles.messagesContainer}>
        {messages.map((message) => renderMessage(message))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu mensaje..."
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 25, 
    marginBottom: 0,
    width: "100%",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderColor: "gray"
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    maxWidth: '50%',
    alignSelf: 'flex-start',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'black',
  },
  otherMessage: {
    backgroundColor: '#c3c3c3',
  },
  myMessageText: {
    fontSize: 16,
    color: '#fff',
  },
  otherMessageText: {
    fontSize: 16,
    color: '#000',
  },
  messageUser: {
    fontSize: 12,
    color: '#666',
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
  },
  inputContainer: {
    width: "90%",

    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderColor: "gray"
  },
  sendButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForoScreen;