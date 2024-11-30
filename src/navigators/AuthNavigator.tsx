import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '@screens/Login';
import Signup from '@screens/Signup';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={Login} />
      <Stack.Screen name="SignUp" component={Signup} />
    </Stack.Navigator>
  );
}
