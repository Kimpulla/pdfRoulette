import { Link, router, useLocalSearchParams } from "expo-router";
import { StatusBar, Dimensions, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Pressable} from 'react-native';
import Pdf from 'react-native-pdf';
import React, {useState, useRef} from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const PdfRead = () => {


    const {uri} = useLocalSearchParams();
    console.log("view: "+ uri);
    const source = {uri:uri?.toString(), cache:true};

    const [currentPage, setCurrentPage] = useState(1); //state of the page
    const [totalPages, setTotalPages] = useState(0);
    const pdfRef = useRef(null);


    // When page changed set it to current page.
    const onPageChanged = (page: number) => {
        setCurrentPage(page);
    }

    // Open random page.
    const openRandomPage = () => {
        const randomPage = Math.floor(Math.random() * totalPages) + 1;
        setCurrentPage(randomPage);
    }

    // When pdf is loaded, get number of pages.
    const onPdfLoadComplete = (numberOfPages:number, filePath:string) => {
        setTotalPages(numberOfPages);
    }

     // Prevent scrolling on the PDF component.
     const handlePdfTouch = () => {
        return false;
    }

  return (
    <View style={styles.container}>

         <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <View style={styles.header}>

                <Pressable onPress={() => router.push("/")}>
                    <MaterialIcons name="arrow-back" size={34} color="white" />
                </Pressable>

                <Text style={styles.text}>PDF ROULETTE</Text>
            </View>
        
       <TouchableWithoutFeedback onPress={handlePdfTouch}>
                <View>
                    <Pdf
                        ref={pdfRef}
                        trustAllCerts={false}
                        source={source}
                        page={currentPage}
                        style={styles.pdf}
                        onPageChanged={onPageChanged}
                        onLoadComplete={onPdfLoadComplete}
                    />
                </View>
            </TouchableWithoutFeedback>

        <TouchableOpacity style={styles.buttonContainer} onPress={openRandomPage}>
                <Text style={styles.buttonText}>Shuffle</Text>
        </TouchableOpacity>
    </View>
  );
}


export default PdfRead

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#121212'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: '#262626',
        borderBottomWidth: 2,
        borderBottomColor: '#CA3E47',
        width: '100%',
    },
    text:{
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    },
    goBack: {
        fontSize: 16,
        color: '#CA3E47',
        fontWeight: 'bold'
    },
    pdf: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height/1.5,
        //position: 'absolute'
    },
    buttonContainer: {
        position: 'absolute',
        bottom: Dimensions.get('window').height * 0.05, // Adjust the position as needed
        backgroundColor: '#505050',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
  });