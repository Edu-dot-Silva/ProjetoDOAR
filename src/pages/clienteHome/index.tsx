import React, { useState } from 'react';
import { View, Text, StatusBar, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { themas } from '../../global/themes';

// Telas
import HomeScreen from './homeClienteScreen';
import ServicosScreen from './servicosClienteScreen';
import AgendamentoScreen from './agendamentosClientesScreen';
import PerfilScreen from './perfilClienteScreen';

// Ícones
const iconHome = require('../../assets/icons/navBarCliente/home.png');
const iconServicos = require('../../assets/icons/navBarCliente/customer-support.png');
const iconAgendamento = require('../../assets/icons/navBarCliente/agenda.png');
const iconPerfil = require('../../assets/icons/navBarCliente/builder.png');

const Tab = createBottomTabNavigator();

export default function ClienteHome() {
  const route = useRoute();
  const { nome } = route.params as { nome: string };

  // Estado para saber qual aba está ativa
const [currentRoute, setCurrentRoute] = useState<string | undefined>('Home');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Cabeçalho só aparece na aba Home */}
      {currentRoute === 'Home' && (
        <View
          style={{
            width: '100%',
            backgroundColor: themas.colors.primaria,
            paddingVertical: 20,
            paddingHorizontal: 24,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Image
            source={iconPerfil}
            style={{
              width: 28,
              height: 28,
              marginRight: 10,
              tintColor: themas.colors.secundaria,
            }}
            resizeMode="contain"
          />
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: themas.colors.secundaria,
            }}
          >
            Bem-vindo, {nome}!
          </Text>
        </View>
      )}

      {/* Navegação inferior */}
      <NavigationContainer
        independent={true}
        onStateChange={(state) => {
          const current = state?.routes[state.index]?.name;
          setCurrentRoute(current);
        }}
      >
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
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  source={iconHome}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: focused
                      ? themas.colors.primaria
                      : '#c04e3c',
                  }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tab.Screen
            name="Serviços"
            component={ServicosScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  source={iconServicos}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: focused
                      ? themas.colors.primaria
                      : '#c04e3c',
                  }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tab.Screen
            name="Agendamento"
            component={AgendamentoScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  source={iconAgendamento}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: focused
                      ? themas.colors.primaria
                      : '#c04e3c',
                  }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tab.Screen
            name="Perfil"
            component={PerfilScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  source={iconPerfil}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: focused
                      ? themas.colors.primaria
                      : '#c04e3c',
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
