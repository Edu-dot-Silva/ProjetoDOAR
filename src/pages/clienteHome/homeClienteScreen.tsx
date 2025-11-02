import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { styles } from './styles';
import { themas } from '../../global/themes';

// imagens locais
const fotoPedreiro = require('../../assets/img/homeClienteScreen/pedreiro.png');
const fotoProntidao = require('../../assets/img/homeClienteScreen/protindao.png');

const imagensObras = [
  require('../../assets/img/homeClienteScreen/obra1.jpg'),
  require('../../assets/img/homeClienteScreen/obra2.jpg'),
  require('../../assets/img/homeClienteScreen/obra3.jpg'),
  require('../../assets/img/homeClienteScreen/obra4.jpg'),
  require('../../assets/img/homeClienteScreen/obra5.jpg'),
];

export default function HomeScreen({ navigation }: any) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsVisible(true);
  };

  const closeModal = () => setIsVisible(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Sobre mim</Text>

      {/* Foto do pedreiro */}
      <Image source={fotoPedreiro} style={styles.fotoPedreiro} resizeMode="cover" />

      {/* Biografia */}
      <Text style={styles.textBio}>
        Sou o <Text style={styles.textBold}>Carlos Almeida</Text>, pedreiro com mais de 15 anos de experiência em
        reformas residenciais e comerciais. Já ajudei dezenas de famílias a transformar seus lares, sempre com foco em
        qualidade, segurança e acabamento impecável.
      </Text>

      <Text style={styles.textBio}>
        A <Text style={styles.textBold}>ReformaExpress</Text> nasceu da minha vontade de oferecer um serviço rápido,
        prático e confiável. Aqui, o cliente agenda direto pelo aplicativo, e eu cuido do resto — desde pequenos
        reparos até obras completas.
      </Text>

      <Text style={styles.textBio}>
        Trabalho com comprometimento, pontualidade e transparência, usando materiais de primeira linha e mantendo você
        informado sobre cada etapa da obra. Meu objetivo é simples: superar expectativas em cada serviço.
      </Text>

      {/* Foto extra */}
      <Image source={fotoProntidao} style={styles.fotoProntidao} resizeMode="cover" />

      {/* Carrossel */}
      <Text style={styles.titleObras}>Algumas das minhas obras</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {imagensObras.map((img, index) => (
          <TouchableOpacity key={index} onPress={() => openModal(index)}>
            <Image source={img} style={styles.imgObra} resizeMode="cover" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal com zoom */}
      <ImageViewing
        images={imagensObras.map((img) => ({ uri: Image.resolveAssetSource(img).uri }))}
        imageIndex={selectedImageIndex}
        visible={isVisible}
        onRequestClose={closeModal}
      />

      {/* Texto final */}
      <Text style={styles.textFinal}>Não perca tempo! Agende minha visita no botão abaixo!</Text>

      {/* Botão */}
      <View style={styles.boxButton}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Agendamento')}>
          <Text style={styles.buttonText}>Agendar visita</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
