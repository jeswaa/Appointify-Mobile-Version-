import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing, TextInput, Image, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import Icon from 'react-native-vector-icons/FontAwesome';

const Login = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  // Load fonts
  const loadFonts = async () => {
    await Font.loadAsync({
      'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
      'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  const startRotation = () => {
    rotateAnim.setValue(0);
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const handleBackPress = () => {
    setLoading(true);
    startRotation();
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('index');
    }, 2000);
  };

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch('http://192.168.68.105:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Response status:', response.status); // For debugging

      if (!response.ok) {
        const text = await response.text(); // Read as plain text
        console.error('Server Response:', text); // Log the HTML or error response
        throw new Error('Failed to log in. Please try again.');
      }

      const text = await response.text(); // Read response as text
      let data;

      try {
        data = JSON.parse(text); // Attempt to parse as JSON
        console.log('Parsed Data:', data);
      } catch (error) {
        console.error('Failed to parse JSON:', text);
        throw new Error('Failed to log in. Please try again.');
      }

      // Check if user exists in response
      if (data && data.success) { // Check if login was successful
        navigation.navigate('homepage'); // Navigate to homepage directly
      } else {
        Alert.alert('Error', 'No user found or invalid response.');
      }
    } catch (error) {
      console.error('Login Error:', error); // Log the actual error for debugging
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    const rotateInterpolate = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
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

  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <Image source={require('../assets/images/image1.png')} style={styles.logo} />
      </View>
      <ScrollView contentContainerStyle={styles.maincol}>
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.greetings}>Hello There</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Pressable style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('signup')}>
            <Text style={styles.signupText}>Don't have an account? Signup</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
      <Pressable style={styles.backButton} onPress={handleBackPress}>
        <Icon name="arrow-left" size={20} color="#4A4A4A" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5F9DB',
  },
  image: {
    height: 50,
    width: 50,
    position: 'absolute',
  },
  maincol: {
    backgroundColor: '#B5C99A',
    height: 550,
    marginTop: 320,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5F9DB',
  },
  logoloading: {
    width: 100,
    height: 100,
  },
  greetings: {
    fontSize: 40,
    marginTop: 50,
    letterSpacing: 5,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#B5C99A',
    borderRadius: 5,
    backgroundColor: '#fff',
    fontFamily: 'Poppins-Regular',
  },
  loginButton: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 24,
    backgroundColor: '#718355',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    color: '#4A4A4A',
    textTransform: 'uppercase',
    fontFamily: 'Poppins-Bold',
  },
  signupText: {
    marginTop: 20,
    color: '#4A4A4A',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Login;
