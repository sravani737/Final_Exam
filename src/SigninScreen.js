import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SigninScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');

    if (!email || !password) {
      if (!email) setEmailError('Email is required');
      if (!password) setPasswordError('Password is required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://192.168.1.27:3000/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        await AsyncStorage.setItem('userToken', data.token);
        Alert.alert('Success', 'Logged in successfully');
        setTimeout(() => {
          if (data.user && data.user.role_name === 'admin') {
            navigation.navigate('AdminDashboard');
          } else {
            navigation.navigate('Home', { userId: data.user._id });
          }
        }, 1500);
      } else {
        if (data.message.includes("Password doesn’t match")) {
          setPasswordError(data.message);
        } else if (data.message.includes("No user exists with this email ID")) {
          setEmailError(data.message);
        } else {
          Alert.alert('Error', data.message || 'Something went wrong');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.innerContainer}>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        {/* Email Field */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        {/* Password Field */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>

        {/* Signup Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an Account?</Text>
          <TouchableOpacity onPress={() =>navigation.navigate('SignupScreen')}>
            <Text style={styles.signupLink}> SignUp</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() =>navigation.navigate('ForgotPasswordScreen')}>
            <Text style={styles.signupLink}>ForgotPassword</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'black',
    fontSize: 60,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  innerContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 30,
    color: '#4caf50',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: 'grey',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginBottom: 10,
  },
  button: {
    width: '90%',
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  disabledButton: {
    backgroundColor: '#a5d6a7',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupLink: {
    color: '#4caf50',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight:5
  },
});
