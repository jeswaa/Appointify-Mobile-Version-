import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native'; // Ensure these imports are correct
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ensure FontAwesome is installed

const Homepage = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Handle logout logic here (e.g., clear session, redirect to login)
    navigation.navigate('Login'); // Navigate back to the Login screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, Roma Lorraine!</Text>
      <Text style={styles.instructionText}>Manage your appointments.</Text>

      {/* Navigation buttons or links */}
      <Pressable style={styles.button} onPress={() => navigation.navigate('ScheduleAppointment')}>
        <Text style={styles.buttonText}>Schedule an Appointment</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="sign-out" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}> Logout</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5F9DB', // Lighter background for a clean look
    padding: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Poppins-Bold',
    color: '#2C3E50', // Darker color for better readability
  },
  instructionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Poppins-Regular',
    color: '#34495E', // Slightly lighter color for contrast
  },
  button: {
    backgroundColor: '#3498DB', // A calming blue for buttons
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%', // Making buttons wider for better usability
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center', // Center align text
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#FF3D3D', // Consistent red for logout
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '80%', // Making the logout button wider as well
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
});

export default Homepage;
