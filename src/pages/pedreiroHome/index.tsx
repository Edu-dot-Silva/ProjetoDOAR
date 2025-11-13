import React from 'react';
import { StatusBar, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { themas } from '../../global/themes';

// Telas (no momento ainda são as do cliente, você pode depois trocar pelos arquivos do pedreiro)
import HomeScreen from './homePedreiroScreen';
import PerfilScreen from './perfilClienteScreen';
import ServicosScreen from './servicosPedreiroScreen';

// Ícones (usando o de serviço como "home" e dashboard no lugar do perfil)
const iconServicos = require('../../assets/icons/navBarCliente/customer-support.png');
const iconAgendamento = require('../../assets/icons/navBarCliente/agenda.png');
const iconDash = require('../../assets/icons/navBarCliente/dashboard.png');

const Tab = createBottomTabNavigator();

export default function PedreiroHome() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Navegação inferior */}
      <NavigationContainer independent={true}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarActiveTintColor: themas.colors.primaria,
            tabBarInactiveTintColor: '#c04e3c',
            tabBarStyle: {
              position: 'absolute',
              bottom: 10,
              left: 10,
              right: 10,
              borderRadius: 20,
              height: 65,
              paddingBottom: 8,
              paddingTop: 6,
              backgroundColor: themas.colors.secundaria,
              elevation: 5,
              shadowOpacity: 0.2,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
          }}
        >
          {/* HOME → agora é “Serviço” e usa o ícone de serviço */}
          <Tab.Screen
            name="Serviços"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  source={iconServicos}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: focused ? themas.colors.primaria : '#c04e3c',
                  }}
                  resizeMode="contain"
                />
              ),
            }}
          />

          {/* Agendamento (mantido) */}
          <Tab.Screen
            name="Agendamentos"
            component={ServicosScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  source={iconAgendamento}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: focused ? themas.colors.primaria : '#c04e3c',
                  }}
                  resizeMode="contain"
                />
              ),
            }}
          />

          {/* Perfil → renomeado para Dashboard e usando ícone de dash */}
          <Tab.Screen
            name="Dashboard"
            component={PerfilScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  source={iconDash}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: focused ? themas.colors.primaria : '#c04e3c',
                  }}
                  resizeMode="contain"
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
