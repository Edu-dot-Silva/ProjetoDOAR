import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  Animated,
  Platform,
} from 'react-native';
import { styles } from './styles';
import Logo from '../../assets/img/logo.png';
import { themas } from '../../global/themes';
import { supabase } from '../../config/supabase';
import bcrypt from 'bcryptjs';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../@types/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      Animated.timing(slideAnim, {
        toValue: -150,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [slideAnim]);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nome, tipo_usuario, senha_hash')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        Alert.alert('Erro', 'Usuário não encontrado');
        return;
      }

      const senhaValida = bcrypt.compareSync(senha, data.senha_hash);
      if (!senhaValida) {
        Alert.alert('Erro', 'Senha incorreta');
        return;
      }

      if (data.tipo_usuario === 1) {
        navigation.navigate('PedreiroHome', {nome: data.nome});
      } else {
        navigation.navigate('ClienteHome', {nome: data.nome});
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer login. Verifique suas credenciais.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themas.colors.primaria,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
          width: '100%',
          alignItems: 'center',
        }}
      >
        <View style={styles.boxTop}>
          <Image source={Logo} style={styles.logoImg} resizeMode="contain" />
        </View>

        <View style={styles.boxMiddle}>
          <Text style={styles.titleInput}>Endereço de e-mail</Text>
          <View style={styles.boxInput}>
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor={themas.colors.secundaria}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />
            <Image
              source={require('../../assets/icons/telaLogin/mail.png')}
              style={styles.iconInput}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.titleInput}>Senha</Text>
          <View style={styles.boxInput}>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor={themas.colors.secundaria}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!showPassword}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={
                  showPassword
                    ? require('../../assets/icons/telaLogin/hide.png')
                    : require('../../assets/icons/telaLogin/view.png')
                }
                style={styles.iconInput}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.textForgetPassword}>Esqueceu sua senha?</Text>
        </View>

        <View style={styles.boxBottom}>
          <TouchableOpacity
            style={styles.buttonLogin}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonLoginText}>
              {loading ? 'Carregando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.textBottom}>
          Novo por aqui?{' '}
          <Text style={styles.textBottomCreate}>Crie sua conta agora!</Text>
        </Text>
      </Animated.View>
    </View>
  );
}
