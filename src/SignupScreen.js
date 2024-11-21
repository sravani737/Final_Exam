import React, { useState } from 'react';
import { Alert, View, Text, TouchableOpacity, TextInput, StyleSheet, Modal } from 'react-native';
import axios from 'axios';

// Define the green color constant
const green = '#32a852';

// Custom Button Component
const Btn = ({ textColor, bgColor, btnLabel, Press }) => (
  <TouchableOpacity
    onPress={Press}
    style={{
      backgroundColor: bgColor,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      width: '60%',
      marginVertical: 10,
    }}
  >
    <Text style={{ color: textColor, fontSize: 16, fontWeight: 'bold' }}>{btnLabel}</Text>
  </TouchableOpacity>
);

// Custom Input Field Component
const Pfield = ({ placeholder, secureTextEntry, keyboardType, value, onChangeText }) => (
  <TextInput
    placeholder={placeholder}
    secureTextEntry={secureTextEntry}
    keyboardType={keyboardType}
    value={value}
    onChangeText={onChangeText}
    style={{
      backgroundColor: '#f8f8f8',
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      width: '80%',
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#ccc',
    }}
  />
);

// Custom Alert Component
const CustomAlert = ({ visible, onClose, title, message, isPositive }) => (
  <Modal transparent={true} visible={visible} animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={[styles.alertBox, { borderColor: isPositive ? green : 'red' }]}>
        <Text style={styles.alertTitle}>{title}</Text>
        <Text style={styles.alertMessage}>{message}</Text>
        <TouchableOpacity onPress={onClose} style={[styles.alertButton, { backgroundColor: isPositive ? green : 'red' }]}>
          <Text style={styles.alertButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default function SignupScreen({navigation}) {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertIsPositive, setAlertIsPositive] = useState(true);

  const validateFields = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/g;

    if (userName.length < 4) newErrors.userName = 'Full name must be at least 4 characters long.';
    if (!emailPattern.test(email)) newErrors.email = 'Please enter a valid email address.';
    if (phoneNumber.length !== 10 || isNaN(phoneNumber)) newErrors.phoneNumber = 'Contact number must be 10 digits.';
    if (password.length < 8) newErrors.password = 'Password must be at least 8 characters long.';
    else if (!specialCharPattern.test(password)) newErrors.password = 'Password must contain at least one special character.';
    if (password.trim() !== confirmPassword.trim()) newErrors.confirmPassword = 'Passwords do not match.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateFields()) return;

    try {
        console.log(email,
            password,
            confirmPassword,userName,phoneNumber);
      const response = await axios.post('http://192.168.1.27:3000/api/v1/users/register', {
        user_name: userName,
        phone_number: phoneNumber,
        email,
        password,
        confirmPassword,
      });
      console.log("here");
      setAlertTitle('Signup Successful');
      setAlertMessage(response.data.message);
      setAlertIsPositive(true);
      setAlertVisible(true);
      props.navigation.navigate('Plogin');
    } catch (error) {
      setAlertTitle('Signup Failed');
      setAlertMessage(error.response ? error.response.data.message : error.message);
      setAlertIsPositive(false);
      setAlertVisible(true);
    }
  };

  const closeAlert = () => setAlertVisible(false);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Signup</Text>
      <View style={styles.formContainer}>
        <Text style={styles.subHeader}>Create a new Account</Text>
        <Pfield placeholder="Full Name" value={userName} onChangeText={setUserName} />
        {errors.userName && <Text style={styles.errorText}>{errors.userName}</Text>}
        <Pfield placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        <Pfield placeholder="Contact Number" keyboardType="number-pad" value={phoneNumber} onChangeText={setPhoneNumber} />
        {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
        <Pfield placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        <Pfield placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        <Text style={styles.termsText}>
          By Signing in, you agree to our <Text style={styles.linkText}>Terms & Conditions</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>
        <Btn textColor="white" bgColor={green} btnLabel="SignUp" Press={handleSignup} />
        <View style={styles.signInText}>
          <Text>Already have an Account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SigninScreen')}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
      <CustomAlert visible={alertVisible} onClose={closeAlert} title={alertTitle} message={alertMessage} isPositive={alertIsPositive} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: green },
  header: { color: 'black', fontSize: 60, fontWeight: 'bold', marginVertical: 10 },
  formContainer: { backgroundColor: 'white', borderTopLeftRadius: 120, padding: 30, width: '100%', alignItems: 'center' },
  subHeader: { color: 'grey', fontSize: 19, fontWeight: 'bold', marginBottom: 20 },
  termsText: { color: 'grey', fontSize: 16, marginVertical: 10 },
  linkText: { color: green, fontWeight: 'bold' },
  signInText: { flexDirection: 'row', marginTop: 10 },
  errorText: { color: 'red', fontSize: 12, alignSelf: 'flex-start', marginBottom: 5 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  alertBox: { backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center', borderWidth: 2 },
  alertTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  alertMessage: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  alertButton: { borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20 },
  alertButtonText: { color: 'white', fontWeight: 'bold' },
});
