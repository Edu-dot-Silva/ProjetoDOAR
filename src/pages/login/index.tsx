import React, { useState } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import Logo from '../../assets/img/logo.png';
import { themas } from '../../global/themes';

export default function Login() {
  const [email,setEmail] = useState();
  const [password,setpassword] = useState();


  return (
    <View style={styles.container}>
      <View style={styles.boxTop}>
        <Image source={Logo} style={styles.logoImg} resizeMode='contain' />
      </View>

      <View style={styles.boxMiddle}>
        <Text style={styles.titleInput}>Endereço de e-mail</Text>
        <View style={styles.boxInput}>
          <TextInput onChangeText={(e)=>setEmail} style={styles.input} placeholder='Digite seu e-mail' placeholderTextColor={themas.colors.secundaria} />
          <Image source={require('../../assets/icons/mail.png')} style={styles.iconInput} resizeMode='contain' />
        </View>

        <Text style={styles.titleInput}>Senha</Text>
        <View style={styles.boxInput}>
          <TextInput onChangeText={(e)=>setpassword} style={styles.input} placeholder='Digite sua senha' placeholderTextColor={themas.colors.secundaria} />
          <Image source={require('../../assets/icons/view.png')} style={styles.iconInput} resizeMode='contain' />
        </View>
        <Text style={styles.textForgetPassword}>Esqueceu sua senha?</Text>
      </View>

      <View style={styles.boxBottom}>
        <TouchableOpacity style={styles.buttonLogin}>
          <Text style={styles.buttonLoginText}>
            Entrar
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.textBottom}>Novo por aqui? <Text style={styles.textBottomCreate}>Crie sua conta agora!</Text></Text>
    </View>
  );
}