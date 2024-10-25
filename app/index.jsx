import { link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font'; // Import font library

const Index = () => {
  const navigation = useNavigation(); // Get the navigation object
  const [loading, setLoading] = useState(false); // State to manage loading
  const [fontsLoaded, setFontsLoaded] = useState(false); // State to manage font loading

  // Create a ref for the animated value
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Function to start the rotation animation
  const startRotation = () => {
    rotateAnim.setValue(0);
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000, // Duration of one complete rotation
        easing: Easing.linear, // Use Easing for smooth animation
        useNativeDriver: true,
      }),
    ).start();
  };

  // Load fonts
  const loadFonts = async () => {
    await Font.loadAsync({
      'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'), // Load the font
      'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    });
    setFontsLoaded(true); // Set fonts loaded to true
  };

  // Use effect to load fonts
  useEffect(() => {
    loadFonts(); // Call the loadFonts function
  }, []);

  // Function to handle button press
  const handleGetStarted = () => {
    setLoading(true); // Set loading to true
    startRotation(); // Start the rotation animation

    // Simulate loading and then navigate to the login page
    setTimeout(() => {
      setLoading(false); // Set loading to false after the animation
      navigation.navigate('login'); // Navigate to the login page
    }, 2000); // Adjust the time as needed for the loading animation
  };

  if (loading) {
    // Loading Screen
    const rotateInterpolate = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'], // Rotate from 0 to 360 degrees
    });

    return (
      <View style={styles.loadingContainer}>
        <Animated.Image
          source={require('../assets/images/logo_2.0.png')}
          style={[styles.logoloading, { transform: [{ rotate: rotateInterpolate }] }]}
        />
      </View>
    );
  }

  // Check if fonts are loaded before rendering the main content
  if (!fontsLoaded) {
    return null; // Or return a loading indicator
  }

  return (
    <View style={styles.container}>
      {/* Header with Image */}
      <View style={styles.header}>
        <Image source={require('../assets/images/logo_2.0.png')} style={styles.logo} />
        <Text style={styles.title}>Appointify</Text>
      </View>

      {/* Main Content */}
      <View style={styles.main}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? '#A5B88A' : '#B5C99A' }, // Change background color on press
            pressed && styles.buttonPressed, // Add scale effect when pressed
          ]}
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>

      {/* Footer */}
      <View>
        <Text style={styles.footer}>&copy; 2024 Appointify. All rights reserved.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#E5F9DB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5F9DB', // Match the main background color
  },
  logoloading: {
    width: 100,  // Set logo size to 100px
    height: 100,
  },
  logo: {
    width: 400,
    height: 400,
  },
  header: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 24,
  },
  title: {
    fontSize: 50,
    fontFamily: 'Poppins-Bold', // Use the loaded font
    color: '#333',
    textTransform: 'uppercase',
    textAlign: 'center',
    position: 'absolute',
    top: 330,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#4A4A4A',
    fontFamily: 'Poppins-Regular',
    textTransform: 'uppercase',
  },
  footer: {
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }], // Scale down the button when pressed
  },
});

export default Index;
