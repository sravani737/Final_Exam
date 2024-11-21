// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import Home from './src/HomeScreen'
// import { NavigationContainer } from '@react-navigation/native'

// export default function App() {
//   return (
//     <View style={{flex:1}}>
//       <NavigationContainer>
//       <Home/>
//       </NavigationContainer>
//     </View>
//   )
// }

// const styles = StyleSheet.create({})


import React from 'react';
import { StyleSheet, View } from 'react-native';
import StackNav from './src/StackNav';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <StackNav />
    </View>
  );
}

const styles = StyleSheet.create({});
