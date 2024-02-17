import { router } from "expo-router";
import React,  { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, Pressable } from 'react-native';
import * as DocumentPicker from "expo-document-picker";
import { showMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message"; 
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import colors from './colors';
export default function HomeScreen() {

  const [isDarkMode, setIsDarkMode] = useState(true); // State to track dark mode
  const [uri, setUri] = useState('');

  useEffect(() => {
    // Load color mode from SecureStore when component mounts
    loadColorMode();
  }, []);

  useEffect(() => {
    // Update status bar color when color mode changes
    StatusBar.setBackgroundColor(isDarkMode ? colors.dark.statusBarBackground : colors.light.statusBarBackground);
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');

    // Save color mode to SecureStore when color mode changes
    saveColorMode();
  }, [isDarkMode]);

  const loadColorMode = async () => {
    try {
      const storedColorMode = await SecureStore.getItemAsync('colorMode');
      if (storedColorMode !== null) {
        setIsDarkMode(storedColorMode === 'dark');
      }
    } catch (error) {
      console.error('Error loading color mode:', error);
    }
  };

  const saveColorMode = async () => {
    try {
      await SecureStore.setItemAsync('colorMode', isDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving color mode:', error);
    }
  };

  // Function to toggle between dark and light mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };


  /**
   * Creates error message, using react native flash message.
   */
  const message = () => {
    showMessage({
      message: "Wrong file format!",
      type: "danger",
    });
  }

  /**
   * Function to select the document with a help of expo documentpicker.
   * 
   */
  const pickDocument = async () => {

    let result = await DocumentPicker.getDocumentAsync({});

    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (uri.endsWith('.pdf')) {
      setUri(uri);
      sendData(uri); // Pass uri to sendData function
    } else {
        message();
    }
  } else {
    message();
  }
}
 
  /**
   * Function redirects user to "view" screen and sends uri data along with it.
   * 
   * @param uri pdf files path.
   */
  const sendData = (uri:string) => { // Accept uri as an argument
    router.push({
      pathname: "/view",
      params: {
        uri: uri,
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? colors.dark.backgroundColor : colors.light.backgroundColor }]}>
      
      <Pressable
        style={styles.toggleButton}
        onPress={toggleDarkMode}
      >
        <Ionicons name={isDarkMode ? 'sunny-outline' : 'moon-outline'} size={24} color={isDarkMode ? colors.dark.text : colors.light.text} />
      </Pressable>


      <FlashMessage position="top" />
      <View/>
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>Start shuffling</Text>
          <Pressable
            onPress={() => pickDocument()}
            style={({ pressed }) => [
              styles.button,
              { opacity: pressed ? 0.6 : 1 } // Set opacity to 0.6 when pressed
            ]}
          >
            <Text style={styles.buttonText}>Select PDF</Text>
          </Pressable>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 30,
    textShadowOffset: { width: 0, height: 0 },
  },
  button: {
    backgroundColor: '#505050',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    elevation: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});
