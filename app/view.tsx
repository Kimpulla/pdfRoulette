import { router, useLocalSearchParams } from "expo-router";
import { StatusBar, Dimensions, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Pressable} from 'react-native';
import Pdf from 'react-native-pdf';
import React, {useState, useRef, useEffect} from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import colors from './colors';

const PdfRead = () => {

    const {uri} = useLocalSearchParams();
    console.log("view: "+ uri);

    const source = {uri:uri?.toString(), cache:true};
    const [currentPage, setCurrentPage] = useState(1); //state of the page
    const [totalPages, setTotalPages] = useState(0);
    const pdfRef = useRef(null);
    const [isDarkMode, setIsDarkMode] = useState(true); // State to track dark mode

    useEffect(() => {
        // Load color mode from SecureStore when component mounts
        loadColorMode();
    }, []);

    // Function to load color mode from SecureStore
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
    
    <View style={[styles.container, { backgroundColor: isDarkMode ? colors.dark.backgroundColor : colors.light.backgroundColor }]}>

            <View style={[styles.header, { backgroundColor: isDarkMode ? colors.dark.statusBarBackground : colors.light.statusBarBackground}]}>

                <Pressable onPress={() => router.push("/")}>
                    <MaterialIcons name={'arrow-back'} size={34} color={isDarkMode ? colors.dark.text : colors.light.text} />
                </Pressable>

                <Text style={[styles.text, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>PDF ROULETTE</Text>
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
                <Text style={[styles.buttonText]}>Shuffle</Text>
        </TouchableOpacity>

        <StatusBar
            backgroundColor={isDarkMode ? colors.dark.statusBarBackground : colors.light.statusBarBackground}
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />

    </View>
  );
}


export default PdfRead

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        width: '100%',
        position: 'absolute',
        top: 0,
        zIndex: 1,
    },
    text:{
        fontSize: 20,
        fontWeight: 'bold',
    },
    pdf: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height/1.5,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: Dimensions.get('window').height * 0.05,
        backgroundColor: '#505050',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 10,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 25,
    },
});