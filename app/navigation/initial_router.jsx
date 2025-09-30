import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/splash-screen';
import LoginScreen from '../screens/login-screen';
import HomeTabRouter from './home_router';
import GetStartedScreen from '../screens/GetStartedScreen';
const Stack = createNativeStackNavigator();
const MyTheme = {
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)',
    background: 'rgb(0,0,0,0)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(244, 244, 244)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};

function InitialRouter() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="SplashScreen">
        <Stack.Screen name="splashscreen" component={SplashScreen} />
        <Stack.Screen name="login-screen" component={LoginScreen} />
        <Stack.Screen name="home-screen" component={HomeTabRouter} screenOptions={{
          animationEnabled: false,  // Disable animations for all screens
        }} />
        <Stack.Screen name="GetStartedScreen" component={GetStartedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default InitialRouter;
