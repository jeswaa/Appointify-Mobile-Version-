import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing, TextInput, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker'; 
import * as ImagePicker from 'expo-image-picker';

const Signup = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [google_id, setGoogleId] = useState('');
  const [uploadimage, setImageUri] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSignup = async () => {
    if (!fullname || !username || !password || !address || !phonenumber || !email || !gender) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://192.168.68.105:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullname, username, password, address, phonenumber, email, gender, google_id, uploadimage }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'You have registered successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('login') },
        ]);
      } else {
        Alert.alert('Error', data.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <Animated.View style={[styles.mainCol, { transform: [{ translateY: slideAnim }] }]}>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <Text style={styles.greetings}>Create an Account</Text>
            <TextInput style={styles.input} placeholder="Full Name" value={fullname} onChangeText={setFullname} />
            <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
            <TextInput style={styles.input} placeholder="Phone Number" value={phonenumber} onChangeText={setPhonenumber} keyboardType="phone-pad" />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <Picker selectedValue={gender} style={styles.picker} onValueChange={(itemValue) => setGender(itemValue)}>
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
            <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
            <Pressable style={styles.uploadButton} onPress={handleImagePicker}>
              <Text style={styles.uploadButtonText}>{uploadimage ? 'Image Selected' : 'Upload Image'}</Text>
            </Pressable>
            <Pressable style={styles.signupButton} onPress={handleSignup} disabled={loading}>
              <Text style={styles.signupButtonText}>{loading ? 'Signing Up...' : 'Signup'}</Text>
            </Pressable>
          </ScrollView>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={20} color="#4A4A4A" />
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#B5C99A',
  },
  greetings: {
    fontSize: 32,
    marginTop: 2,
    letterSpacing: 1,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#B5C99A',
    borderRadius: 5,
    backgroundColor: '#fff',
    fontFamily: 'Poppins-Regular',
  },
  picker: {
    width: '100%',
    height: 50,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#B5C99A',
    borderRadius: 5,
    backgroundColor: '#fff',
    color: '#4A4A4A',
    fontFamily: 'Poppins-Regular',
  },
  uploadButton: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#718355',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#fff',
    textTransform: 'uppercase',
    fontFamily: 'Poppins-Bold',
  },
  signupButton: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: '#97A97C',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  signupButtonText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B5C99A',
  },
  mainCol: {
    flex: 1,
    marginTop: 100,
    justifyContent: 'center',
  },
  scrollViewContainer: {
    paddingBottom: 50,
  },
  backButton: {
    position: 'absolute',
    top: -50,
    left: 20,
  },
});

export default Signup;
