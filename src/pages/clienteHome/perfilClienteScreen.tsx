import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../config/supabase';
import { styles } from './styles';
import { themas } from '../../global/themes';
import { ActivityIndicator } from 'react-native';

// Função utilitária para validar CPF
function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf[10]);
}

function formatarDataBrasileira(dataISO: string | null): string {
  if (!dataISO) return '';
  const data = new Date(dataISO);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

export default function PerfilScreen() {
  const [usuario, setUsuario] = useState<any>(null);
  const [editando, setEditando] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [repetirSenha, setRepetirSenha] = useState('');

  useEffect(() => {
    carregarUsuario();
    carregarFotoLocal(); // ⬅️ carregar foto armazenada
  }, []);

  const carregarUsuario = async () => {
    const { data } = await supabase.from('usuarios').select('*').eq('id', 1).single();
    setUsuario(data);
  };

  // ⬅️ SALVAR FOTO NO ASYNC STORAGE
  const salvarFotoLocal = async (uri: string) => {
    try {
      await AsyncStorage.setItem('@foto_perfil', uri);
    } catch (e) {
      console.log('Erro ao salvar foto:', e);
    }
  };

  // ⬅️ CARREGAR FOTO
  const carregarFotoLocal = async () => {
    try {
      const uri = await AsyncStorage.getItem('@foto_perfil');
      if (uri) {
        setFoto(uri);
      }
    } catch (e) {
      console.log('Erro ao carregar foto:', e);
    }
  };

  const escolherFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFoto(uri);
      salvarFotoLocal(uri); // ⬅️ salva automaticamente
    }
  };

  const salvarEdicao = async () => {
    if (!usuario) return;

    if (usuario.cpf && !validarCPF(usuario.cpf)) {
      Alert.alert('CPF inválido', 'Por favor, insira um CPF válido.');
      return;
    }

    if (novaSenha || repetirSenha) {
      if (novaSenha !== repetirSenha) {
        Alert.alert('Erro', 'As senhas não coincidem.');
        return;
      }
    }

    const updateData: any = {
      nome: usuario.nome,
      cpf: usuario.cpf,
      email: usuario.email,
      telefone: usuario.telefone,
      data_nascimento: usuario.data_nascimento,
    };

    if (novaSenha) updateData.senha_hash = novaSenha;

    const { error } = await supabase
      .from('usuarios')
      .update(updateData)
      .eq('id', usuario.id);

    if (!error) {
      Alert.alert('Sucesso', 'Dados salvos com sucesso!');
      setEditando(false);
      setNovaSenha('');
      setRepetirSenha('');
    } else {
      Alert.alert('Erro', 'Falha ao salvar alterações.');
    }
  };

  if (!usuario) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={themas.colors.secundaria} />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setMostrarCalendario(false);
    if (selectedDate) {
      setUsuario({
        ...usuario,
        data_nascimento: selectedDate.toISOString().split('T')[0],
      });
    }
  };

  return (
    <ScrollView style={styles.containerPerfil} contentContainerStyle={styles.scrollContentPerfil}>
      
      {/* Foto de perfil */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={escolherFoto}>
          <Image
            source={
              foto
                ? { uri: foto }
                : require('../../assets/img/perfilClienteScreen/builder.png')
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>

        <Text style={styles.profileName}>{usuario.nome}</Text>
        <Text style={styles.profileEmail}>{usuario.email}</Text>
        <Text style={styles.profilePhone}>{usuario.telefone || 'Sem telefone cadastrado'}</Text>
      </View>

      {/* Botão Editar */}
      <TouchableOpacity style={styles.editButton} onPress={() => setEditando(!editando)}>
        <Text style={styles.editButtonText}>{editando ? 'Cancelar' : 'Editar dados'}</Text>
      </TouchableOpacity>

      {/* Campos editáveis */}
      {editando && (
        <View style={styles.editSection}>

          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={usuario.nome}
            onChangeText={(t) => setUsuario({ ...usuario, nome: t })}
          />

          <TextInput
            style={styles.input}
            placeholder="CPF"
            value={usuario.cpf || ''}
            onChangeText={(t) => setUsuario({ ...usuario, cpf: t })}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={usuario.email}
            onChangeText={(t) => setUsuario({ ...usuario, email: t })}
          />

          <TextInput
            style={styles.input}
            placeholder="Telefone"
            value={usuario.telefone || ''}
            onChangeText={(t) => setUsuario({ ...usuario, telefone: t })}
          />

          {/* Data de nascimento */}
          <TouchableOpacity onPress={() => setMostrarCalendario(true)}>
            <TextInput
              style={styles.input}
              placeholder="Data de nascimento"
              value={formatarDataBrasileira(usuario.data_nascimento)}
              editable={false}
              placeholderTextColor={themas.colors.secundaria}
            />
          </TouchableOpacity>

          {mostrarCalendario && (
            <DateTimePicker
              value={
                usuario.data_nascimento ? new Date(usuario.data_nascimento) : new Date()
              }
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}

          {/* Senhas */}
          <TextInput
            style={[styles.input, { color: '#dc5633' }]}
            placeholder="Nova senha"
            secureTextEntry
            value={novaSenha}
            onChangeText={setNovaSenha}
          />

          <TextInput
            style={[styles.input, { color: '#dc5633' }]}
            placeholder="Repetir senha"
            secureTextEntry
            value={repetirSenha}
            onChangeText={setRepetirSenha}
          />

          {/* Salvar */}
          <TouchableOpacity style={styles.saveButton} onPress={salvarEdicao}>
            <Text style={styles.saveButtonText}>Salvar alterações</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
