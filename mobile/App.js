import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

// Replace with your backend URL. If testing on Android emulator, use 10.0.2.2 instead of localhost
// If testing on a physical device, use your machine's local IP address (e.g., 192.168.1.X)
const BACKEND_URL = 'http://172.18.226.85:5000/api'; 

export default function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  
  const [activeScreen, setActiveScreen] = useState('home'); // 'home', 'complaint'
  const [complaintText, setComplaintText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastComplaintResult, setLastComplaintResult] = useState(null);

  const handleLogin = () => {
    if (phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    // Simple mock auth
    setUserId(phoneNumber);
    setIsLoggedIn(true);
  };

  const submitComplaint = async () => {
    if (!complaintText.trim()) return;

    setIsLoading(true);
    setLastComplaintResult(null);
    try {
      // Simulating backend call
      const response = await axios.post(`${BACKEND_URL}/complaints`, {
        text: complaintText,
        userId: userId
      });

      setLastComplaintResult(response.data);
      setComplaintText('');
      Alert.alert('Success', `Complaint Registered! Category: ${response.data.category}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit complaint. ' + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Samadhaan</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    );
  }

  if (activeScreen === 'complaint') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Report an Issue</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the issue (e.g., Pothole on main road)"
          multiline
          numberOfLines={4}
          value={complaintText}
          onChangeText={setComplaintText}
        />
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={submitComplaint}>
            <Text style={styles.buttonText}>Submit Complaint</Text>
          </TouchableOpacity>
        )}
        
        {lastComplaintResult && (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>Category: {lastComplaintResult.category}</Text>
            <Text style={styles.resultText}>Confidence: {(lastComplaintResult.confidence * 100).toFixed(1)}%</Text>
            <Text style={styles.resultText}>Status: Pending</Text>
          </View>
        )}

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => setActiveScreen('home')}>
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hello, {userId}</Text>
      
      <TouchableOpacity style={styles.card} onPress={() => setActiveScreen('complaint')}>
        <Text style={styles.cardTitle}>📝 Text Complaint</Text>
        <Text style={styles.cardDesc}>Report an issue by typing details</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.card, { opacity: 0.5 }]} disabled={true} onPress={() => Alert.alert("Coming Soon")}>
        <Text style={styles.cardTitle}>🎙️ Voice Agent (Coming Soon)</Text>
        <Text style={styles.cardDesc}>Talk to our AI assistant</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={() => setIsLoggedIn(false)}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  header: {
    fontSize: 20,
    marginBottom: 40,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    marginTop: 40,
  },
  card: {
    width: '100%',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDesc: {
    color: '#666',
  },
  resultBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    width: '100%',
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  }
});
