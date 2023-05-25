import React from 'react';
import { StyleSheet } from 'react-native';
import ForgotPWPage from './pages/ForgotPWPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StackNavigator from './StackNavigator';
import AuthNavigator from './AuthNavigator';

export default function App() {
  return (
    <>
      <AuthNavigator/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});