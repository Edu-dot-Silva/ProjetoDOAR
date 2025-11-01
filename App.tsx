import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './src/@types/navigation';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Login from './src/pages/login';
import PedreiroHome from './src/pages/pedreiroHome';
import ClienteHome from './src/pages/clienteHome';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login" 
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: 'white' }
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="PedreiroHome" component={PedreiroHome} />
          <Stack.Screen name="ClienteHome" component={ClienteHome} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
