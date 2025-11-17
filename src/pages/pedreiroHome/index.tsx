import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import AgendamentosPedreiroScreen from './servicosPedreiroScreen';
import { styles } from './styles';

export default function PedreiroHome() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <AgendamentosPedreiroScreen />
    </SafeAreaView>
  );
}
