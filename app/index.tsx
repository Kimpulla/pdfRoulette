import { Link, router } from "expo-router";
import React,  { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import * as DocumentPicker from "expo-document-picker";
import PdfRead from "./view";

export default function HomeScreen() {

  const [uri, setUri] = useState('');

  const pickDocument = async () => {

    let result = await DocumentPicker.getDocumentAsync({});

    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setUri(uri);
      sendData(uri); // Pass uri to sendData function
    } else {
        console.log("No assets found in the result.");
    }
  }
 
  const sendData = (uri:string) => { // Accept uri as an argument
    router.push({
      pathname: "/view",
      params: {
        uri: uri,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Start shuffling</Text>
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
    backgroundColor: '#121212',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#121212',
    zIndex: -1,
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
    color: '#fff',
    textShadowColor: '#00f',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
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
});
