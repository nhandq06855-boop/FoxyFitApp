import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListingScreen from '../screens/ListingScreen';
import DetailScreen from '../screens/DetailScreen';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Listing"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen 
          name="Listing" 
          component={ListingScreen} 
        />
        <Stack.Screen 
          name="Detail" 
          component={DetailScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
