import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import HomeScreen from "./HomeScreen"
import DetailsScreen from "./DetailsScreen"
import SignupScreen from './SignupScreen'
import SigninScreen from './SigninScreen'
import ForgotPasswordScreen from './ForgotPasswordScreen'
import ResetPasswordScreen from './ResetPasswordScreen'

const Stack = createNativeStackNavigator();

// const AuthStack=()=>{
//     return(
//         <NavigationContainer>
//             <Stack.Screen name="SignupScreen" component={SignupScreen}/>
//             <Stack.Screen name="SigninScreen" component={SigninScreen}/>
//         </NavigationContainer>
//     )
// }
export default StackNav=()=>{
    return(
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown:false}}>
                <Stack.Screen name="SignupScreen" component={SignupScreen}/>
                <Stack.Screen name="SigninScreen" component={SigninScreen}/>
                <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen}/>
                <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen}/>
                <Stack.Screen name="Home" component={HomeScreen}/>
                <Stack.Screen name="Details" component={DetailsScreen}/> 
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({})