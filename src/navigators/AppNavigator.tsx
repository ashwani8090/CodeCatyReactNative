import React from 'react';

import ChatHeader from '@components/ChatHeader';
import HomeHeader from '@components/HomeHeader';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Chat} from '@screens/Chat';
import {Friends} from '@screens/Friends';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          header: HomeHeader,
        }}
        name="Home"
        component={Friends}
      />
      <Stack.Screen
        options={{
          headerTitle: () => <ChatHeader />,
        }}
        name="Chat"
        component={Chat}
      />
    </Stack.Navigator>
  );
}
