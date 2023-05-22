import React from 'react';
import { View } from 'react-native';
import LoginPage from './pages/LoginPage';
import StackNavigator from './StackNavigator';

export default function App() {
  return (
    <View>
      <LoginPage>
        <StackNavigator/>
      </LoginPage>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });