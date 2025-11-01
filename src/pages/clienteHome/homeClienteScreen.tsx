import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { themas } from '../../global/themes';

// imagens (ajuste os caminhos conforme o seu projeto)
const fotoPedreiro = require('../../assets/img/homeClienteScreen/pedreiro.png');
const fotoProntidao = require('../../assets/img/homeClienteScreen/protindao.png');

// placeholder para carrossel (você pode depois usar um FlatList horizontal ou uma lib tipo react-native-snap-carousel)
const imagensObras = [
  require('../../assets/img/homeClienteScreen/obra1.jpg'),
  require('../../assets/img/homeClienteScreen/obra2.jpg'),
  require('../../assets/img/homeClienteScreen/obra3.jpg'),
];

export default function HomeScreen({ navigation }: any) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: themas.colors.primaria }} contentContainerStyle={{ padding: 20 }}>
      
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: themas.colors.primaria, marginBottom: 10 }}>
        Sobre mim
      </Text>

      {/* Foto do pedreiro */}
      <Image
        source={fotoPedreiro}
        style={{ width: '100%', height: 220, borderRadius: 12, marginBottom: 15 }}
        resizeMode="cover"
      />

      {/* Biografia */}
      <Text style={{ fontSize: 16, color: '#333', marginBottom: 10 }}>
        Sou o <Text style={{ fontWeight: '600' }}>Carlos Almeida</Text>, pedreiro com mais de 15 anos de experiência em reformas residenciais e comerciais. Já ajudei dezenas de famílias a transformar seus lares, sempre com foco em qualidade, segurança e acabamento impecável.
      </Text>

      <Text style={{ fontSize: 16, color: '#333', marginBottom: 10 }}>
        A <Text style={{ color: themas.colors.secundaria, fontWeight: '600' }}>ReformaExpress</Text> nasceu da minha vontade de oferecer um serviço rápido, prático e confiável. Aqui, o cliente agenda direto pelo aplicativo, e eu cuido do resto — desde pequenos reparos até obras completas.
      </Text>

      <Text style={{ fontSize: 16, color: '#333', marginBottom: 20 }}>
        Trabalho com comprometimento, pontualidade e transparência, usando materiais de primeira linha e mantendo você informado sobre cada etapa da obra. Meu objetivo é simples: superar expectativas em cada serviço.
      </Text>

      {/* Foto de prontidão */}
      <Image
        source={fotoProntidao}
        style={{ width: '100%', height: 220, borderRadius: 12, marginBottom: 15 }}
        resizeMode="cover"
      />

      {/* Carrossel simples */}
      <Text style={{ fontSize: 18, fontWeight: '600', color: themas.colors.primaria, marginBottom: 10 }}>
        Algumas das minhas obras
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {imagensObras.map((img, index) => (
          <Image
            key={index}
            source={img}
            style={{ width: 180, height: 130, borderRadius: 10, marginRight: 10 }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Texto final */}
      <Text style={{ fontSize: 16, color: '#333', marginTop: 20, textAlign: 'center' }}>
        🚀 Não perca tempo! Agende minha visita no botao abaixo!.
      </Text>

      {/* Botão de agendar */}
      <TouchableOpacity
        style={{
          marginTop: 20,
          backgroundColor: themas.colors.secundaria,
          paddingVertical: 15,
          borderRadius: 10,
        }}
        onPress={() => navigation.navigate('Agendamento')}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
          Agendar visita
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
