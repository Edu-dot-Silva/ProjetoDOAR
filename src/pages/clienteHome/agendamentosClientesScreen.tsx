import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardTypeOptions
} from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { supabase } from '../../config/supabase';
import { styles } from './styles';
import { themas } from '../../global/themes';

export default function AgendamentoScreen() {
  const usuarioId = 1; // substituir pelo auth

  const [servicos, setServicos] = useState<any[]>([]);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [openTipo, setOpenTipo] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null);
  const [tipos, setTipos] = useState<{ label: string; value: string }[]>([]);

  const [openServico, setOpenServico] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState<number | null>(null);

  const [descricao, setDescricao] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState({
    rua: '',
    bairro: '',
    cidade: '',
    estado: '',
    numero: '',
    complemento: '',
  });

  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);

  // 🔹 Carregar serviços + agendamentos
  useEffect(() => {
    const carregar = async () => {
      const { data: servicosData } = await supabase
        .from('servicos')
        .select('*')
        .eq('ativo', true);

      if (servicosData) {
        setServicos(servicosData);

        const tiposUnicos = Array.from(new Set(servicosData.map((s: any) => s.tipo)));
        setTipos(
          tiposUnicos.map((t) => ({
            label: t.charAt(0).toUpperCase() + t.slice(1),
            value: t,
          }))
        );
      }

      const { data: agends } = await supabase
        .from('agendamentos')
        .select(`
          *,
          servicos ( titulo, tipo ),
          enderecos ( rua, numero, bairro, cidade, estado, complemento )
        `)
        .eq('usuario_id', usuarioId)
        .order('criado_em', { ascending: false });

      if (agends) setAgendamentos(agends);

      setLoading(false);
    };

    carregar();
  }, []);

  // 🔹 Cancelar agendamento
  const cancelarAgendamento = async (id: number) => {
    Alert.alert('Cancelar Agendamento', 'Deseja realmente cancelar?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('agendamentos').delete().eq('id', id);
          setAgendamentos((prev) => prev.filter((a) => a.id !== id));
        },
      },
    ]);
  };

  // 🔹 API ViaCEP
  const buscarEndereco = async (valorCep: string) => {
    const cepLimpo = valorCep.replace(/\D/g, '');
    setCep(cepLimpo);

    if (cepLimpo.length === 8) {
      try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await resposta.json();

        if (!dados.erro) {
          setEndereco((prev) => ({
            ...prev,
            rua: dados.logradouro || '',
            bairro: dados.bairro || '',
            cidade: dados.localidade || '',
            estado: dados.uf || '',
          }));
        }
      } catch { }
    }
  };

  // 🔹 Confirmar agendamento SEM ENDEREÇOS SALVOS
  const confirmarAgendamento = async () => {
    if (!servicoSelecionado) {
      Alert.alert('Erro', 'Selecione um serviço.');
      return;
    }

    if (!cep || !endereco.rua || !endereco.numero || !endereco.cidade) {
      Alert.alert('Erro', 'Preencha corretamente o endereço.');
      return;
    }

    // 👉 Sempre cria um endereço NOVO
    const { data: novoEndereco } = await supabase
      .from('enderecos')
      .insert([
        {
          usuario_id: usuarioId,
          cep,
          rua: endereco.rua,
          numero: endereco.numero,
          bairro: endereco.bairro,
          cidade: endereco.cidade,
          estado: endereco.estado,
          complemento: endereco.complemento,
        },
      ])
      .select('id')
      .single();

    if (!novoEndereco) {
      Alert.alert('Erro', 'Falha ao salvar endereço.');
      return;
    }

    const payload = {
      usuario_id: usuarioId,
      servico_id: servicoSelecionado,
      endereco_id: novoEndereco.id,
      descricao_local: descricao,
      status: 'pendente',
      criado_em: new Date().toISOString(),
    };

    const { data: novoAgendamento } = await supabase
      .from('agendamentos')
      .insert([payload])
      .select(`
        *,
        servicos ( titulo, tipo ),
        enderecos ( rua, numero, bairro, cidade, estado, complemento )
      `);

    if (novoAgendamento && novoAgendamento.length > 0) {
      setAgendamentos((prev) => [novoAgendamento[0], ...prev]);
      Alert.alert('Sucesso', 'Agendamento criado com sucesso!');
      limparCampos();
      setMostrandoFormulario(false);
    } else {
      Alert.alert('Erro', 'Não foi possível criar o agendamento.');
    }
  };

  const limparCampos = () => {
    setTipoSelecionado(null);
    setServicoSelecionado(null);
    setCep('');
    setEndereco({
      rua: '',
      bairro: '',
      cidade: '',
      estado: '',
      numero: '',
      complemento: '',
    });
    setDescricao('');
  };

  const servicosFiltrados = useMemo(
    () => (tipoSelecionado ? servicos.filter((s) => s.tipo === tipoSelecionado) : []),
    [servicos, tipoSelecionado]
  );

  return (
    <KeyboardAwareScrollView
      style={styles.containerPerfil}
      contentContainerStyle={[styles.scrollContentPerfil, { paddingBottom: 120 }]}
      extraHeight={150}
      enableOnAndroid
    >
      <Text style={styles.title}>Meus Agendamentos</Text>

      {/* Botão abrir/fechar formulário */}
      <TouchableOpacity
        style={[styles.saveButton, { marginTop: 10, backgroundColor: themas.colors.secundaria }]}
        onPress={() => setMostrandoFormulario((prev) => !prev)}
      >
        <Text style={[styles.saveButtonText, { color: themas.colors.primaria }]}>
          {mostrandoFormulario ? 'Fechar formulário' : 'Agendar novo serviço'}
        </Text>
      </TouchableOpacity>

      {/* FORMULÁRIO */}
      {mostrandoFormulario && (
        <View style={{ marginTop: -50, marginBottom: 10 }}>
          <Text style={styles.subtitulo}>Agendar novo serviço</Text>

          {/* Tipo */}
          <View style={{ zIndex: 3000, marginBottom: 10 }}>
            <DropDownPicker
              open={openTipo}
              value={tipoSelecionado}
              items={tipos}
              setOpen={setOpenTipo}
              setValue={setTipoSelecionado}
              placeholder="Selecione o tipo"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>

          {/* Serviço */}
          <View style={{ zIndex: 2000, marginBottom: 10 }}>
            <DropDownPicker
              open={openServico}
              value={servicoSelecionado}
              items={servicosFiltrados.map((s) => ({ label: s.titulo, value: s.id }))}
              setOpen={(o) => {
                if (o) setOpenTipo(false);
                setOpenServico(o);
              }}
              setValue={setServicoSelecionado}
              placeholder="Selecione o serviço"
              disabled={!tipoSelecionado}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>

          {/* 🟢 ENDEREÇO — SEM DROPDOWN, SEM LISTA, SEM ENDEREÇOS SALVOS */}
          <TextInput
            style={styles.input}
            placeholder="CEP"
            placeholderTextColor={themas.colors.secundaria}
            value={cep}
            keyboardType="numeric"
            onChangeText={buscarEndereco}
          />

          {[
            { label: 'Rua', key: 'rua', value: endereco.rua },
            { label: 'Número', key: 'numero', value: endereco.numero },
            { label: 'Bairro', key: 'bairro', value: endereco.bairro },
            { label: 'Cidade', key: 'cidade', value: endereco.cidade },
            { label: 'Estado', key: 'estado', value: endereco.estado },
            { label: 'Complemento', key: 'complemento', value: endereco.complemento },
          ].map((campo) => (
            <TextInput
              key={campo.key}
              style={styles.input}
              placeholder={campo.label}
              placeholderTextColor={themas.colors.secundaria}
              value={campo.value}
              onChangeText={(t) => setEndereco((p) => ({ ...p, [campo.key]: t }))}
            />
          ))}

          {/* Descrição */}
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Descrição do local / observações"
            placeholderTextColor={themas.colors.secundaria}
            value={descricao}
            onChangeText={setDescricao}
            multiline
          />

          {/* Botão Confirmar */}
          <TouchableOpacity style={styles.saveButton} onPress={confirmarAgendamento}>
            <Text style={styles.saveButtonText}>Confirmar agendamento</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* LISTA DE AGENDAMENTOS */}
      {loading ? (
        <Text style={styles.loadingText}>Carregando...</Text>
      ) : agendamentos.length > 0 ? (
        <FlatList
          data={agendamentos}
          keyExtractor={(ag) => String(ag.id)}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={[styles.cardAgendamento, { marginBottom: 12 }]}>
              <Text style={[styles.cardTituloAgendamento, { textAlign: 'center' }]}>
                {item.servicos?.titulo}
              </Text>

              {item.servicos?.tipo && (
                <Text
                  style={[
                    styles.cardDescricaoAgendamento,
                    { color: themas.colors.primaria, textAlign: 'center' },
                  ]}
                >
                  Tipo: {item.servicos.tipo}
                </Text>
              )}

              {item.enderecos && (
                <Text
                  style={[
                    styles.cardDescricao,
                    { textAlign: 'center', color: themas.colors.primaria },
                  ]}
                >
                  Endereço:{' '}
                  {`${item.enderecos.rua}, ${item.enderecos.numero} - ${item.enderecos.bairro}, ${item.enderecos.cidade}-${item.enderecos.estado}`}
                </Text>
              )}

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  { backgroundColor: themas.colors.primaria, marginTop: 8 },
                ]}
                onPress={() => cancelarAgendamento(item.id)}
              >
                <Text style={[styles.saveButtonText, { color: themas.colors.secundaria }]}>
                  Cancelar agendamento
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>Sem agendamentos</Text>
        </View>
      )}
    </KeyboardAwareScrollView>
  );
}
