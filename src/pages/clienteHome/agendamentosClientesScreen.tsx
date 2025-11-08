import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
  KeyboardTypeOptions
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { supabase } from '../../config/supabase';
import { styles } from './styles';
import { themas } from '../../global/themes';

export default function AgendamentoScreen() {
  const usuarioId = 1; // substitua quando tiver auth implementado

  const [servicos, setServicos] = useState<any[]>([]);
  const [enderecos, setEnderecos] = useState<any[]>([]);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [openTipo, setOpenTipo] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null);
  const [tipos, setTipos] = useState<{ label: string; value: string }[]>([]);

  const [openServico, setOpenServico] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState<number | null>(null);

  const [openEndereco, setOpenEndereco] = useState(false);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<number | 'novo' | null>(null);

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

  const [data, setData] = useState<Date>(new Date());
  const [mostrarData, setMostrarData] = useState(false);
  const [mostrarHora, setMostrarHora] = useState(false);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);

  // 🔹 Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      const { data: servicosData, error: servicosErro } = await supabase
        .from('servicos')
        .select('*')
        .eq('ativo', true);

      if (!servicosErro && servicosData) {
        setServicos(servicosData);
        const tiposUnicos = Array.from(new Set(servicosData.map((s: any) => s.tipo)));
        setTipos(
          tiposUnicos.map((t) => ({
            label: t.charAt(0).toUpperCase() + t.slice(1),
            value: t,
          }))
        );
      }

      await carregarEnderecos();
      await carregarAgendamentos();
    };

    carregarDados();
  }, []);

  const carregarEnderecos = async () => {
    const { data, error } = await supabase
      .from('enderecos')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('criado_em', { ascending: false });

    if (!error && data) setEnderecos(data);
  };

  const carregarAgendamentos = async () => {
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        *,
        servicos (
          titulo,
          tipo
        ),
      enderecos (
      rua,
      numero,
      bairro,
      cidade,
      estado,
      complemento
    )
      `)
      .eq('usuario_id', usuarioId)
      .order('criado_em', { ascending: false });

    if (!error && data) setAgendamentos(data);
    setLoading(false);
  };

  // 🔹 Deletar agendamento do banco
  const cancelarAgendamento = async (id: number) => {
    Alert.alert('Cancelar Agendamento', 'Deseja realmente cancelar este agendamento?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('agendamentos').delete().eq('id', id);
          if (!error) {
            setAgendamentos((prev) => prev.filter((a) => a.id !== id));
            Alert.alert('Removido', 'O agendamento foi excluído com sucesso.');
          } else {
            Alert.alert('Erro', 'Falha ao excluir o agendamento.');
          }
        },
      },
    ]);
  };

  const buscarEndereco = async (valorCep: string) => {
    const cepLimpo = valorCep.replace(/\D/g, '');
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
        } else {
          Alert.alert('CEP não encontrado');
        }
      } catch {
        Alert.alert('Erro ao buscar o CEP');
      }
    }
  };

  const confirmarAgendamento = async () => {
    if (!servicoSelecionado || !data) {
      Alert.alert('Erro', 'Preencha serviço, data e hora.');
      return;
    }

    let enderecoId = null;

    if (enderecoSelecionado && enderecoSelecionado !== 'novo') {
      // Endereço existente
      enderecoId = enderecoSelecionado;
    } else {
      // Adicionando novo endereço
      if (!cep || !endereco.rua || !endereco.cidade) {
        Alert.alert('Erro', 'Preencha corretamente o novo endereço.');
        return;
      }

      const { data: novoEndereco, error: erroEndereco } = await supabase
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

      if (erroEndereco || !novoEndereco) {
        Alert.alert('Erro', 'Falha ao salvar o novo endereço.');
        return;
      }

      enderecoId = novoEndereco.id;
      await carregarEnderecos();
    }

    // 🧠 Verifica se o horário já está ocupado
    const dataAgendamento = data.toISOString().split('T')[0];
    const horaAgendamento = data.toTimeString().slice(0, 5); // "15:00"

const { data: conflito, error: erroConflito } = await supabase
  .from('agendamentos')
  .select('id, data_agendamento, hora_agendamento')
  .eq('data_agendamento', dataAgendamento)
  .like('hora_agendamento', `${horaAgendamento}%`)
  .neq('status', 'cancelado')
  .limit(1);

console.log('🕒 Verificando conflito:', { dataAgendamento, horaAgendamento, conflito, erroConflito });

if (!erroConflito && conflito && conflito.length > 0) {
  Alert.alert(
    'Horário ocupado',
    `Já existe um agendamento em ${horaAgendamento} para o dia ${formatarDataBrasileira(dataAgendamento)}.`
  );
  return;
}



    // ✅ Se estiver livre, prossegue com o agendamento
    const payload = {
      usuario_id: usuarioId,
      servico_id: servicoSelecionado,
      endereco_id: enderecoId,
      data_agendamento: dataAgendamento,
      hora_agendamento: horaAgendamento,
      descricao_local: descricao,
      status: 'pendente' as const,
      criado_em: new Date().toISOString(),
    };

    const { data: novo, error } = await supabase
      .from('agendamentos')
      .insert([payload])
      .select(`
      *,
      servicos (
        titulo,
        tipo
      ),
      enderecos (
        rua,
        numero,
        bairro,
        cidade,
        estado,
        complemento
      )
    `);

    if (!error && novo && novo.length > 0) {
      setAgendamentos((prev) => [novo[0], ...prev]);
      Alert.alert('Sucesso', 'Seu agendamento foi criado com sucesso.');
      limparCampos();
      setMostrandoFormulario(false);
    } else {
      Alert.alert('Erro', 'Não foi possível criar o agendamento.');
    }
  };


  const limparCampos = () => {
    setTipoSelecionado(null);
    setServicoSelecionado(null);
    setEnderecoSelecionado(null);
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
    setData(new Date());
  };

  const formatarDataBrasileira = (dataISO: string, hora?: string) => {
    if (!dataISO) return '—';
    try {
      const dataCompleta = hora ? `${dataISO}T${hora}` : dataISO;
      const d = new Date(dataCompleta);
      if (isNaN(d.getTime())) return '—';
      const dia = String(d.getDate()).padStart(2, '0');
      const mes = String(d.getMonth() + 1).padStart(2, '0');
      const ano = d.getFullYear();
      return `${dia}/${mes}/${ano}`;
    } catch {
      return '—';
    }
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

      <TouchableOpacity
        style={[
          styles.saveButton,
          { marginTop: 10, backgroundColor: themas.colors.secundaria },
        ]}
        onPress={() => setMostrandoFormulario((prev) => !prev)}
      >
        <Text style={[styles.saveButtonText, { color: themas.colors.primaria }]}>
          {mostrandoFormulario ? 'Fechar formulário' : 'Agendar novo serviço'}
        </Text>
      </TouchableOpacity>

      {mostrandoFormulario && (
        <View style={{ marginTop: -50, marginBottom: 10 }}>
          <Text style={styles.subtitulo}>Agendar novo serviço</Text>

          {/* Tipo de Serviço */}
          <View style={{ zIndex: 3000, marginBottom: 10 }}>
            <DropDownPicker
              open={openTipo}
              value={tipoSelecionado}
              items={tipos}
              setOpen={(o) => {
                // @ts-ignore
                if (o) setOpenServico(false);
                setOpenTipo(o);
              }}
              setValue={setTipoSelecionado}
              setItems={setTipos}
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
                // @ts-ignore
                if (o) setOpenTipo(false);
                setOpenServico(o);
              }}
              setValue={setServicoSelecionado}
              setItems={() => { }}
              placeholder="Selecione o serviço"
              disabled={!tipoSelecionado}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>

          {/* Endereço: Escolher existente ou novo */}
          <View style={{ zIndex: 1500, marginBottom: 10 }}>
            <DropDownPicker
              open={openEndereco}
              value={enderecoSelecionado}
              items={[
                ...enderecos.map((e) => ({
                  label: `${e.rua}, ${e.numero} - ${e.bairro} (${e.cidade})`,
                  value: e.id,
                })),
                { label: '➕ Adicionar novo endereço', value: 'novo' },
              ]}
              setOpen={setOpenEndereco}
              setValue={setEnderecoSelecionado}
              placeholder="Selecione o endereço"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>

          {/* Se o usuário escolher "novo", mostrar os campos */}
          {enderecoSelecionado === 'novo' && (
            <>
              {[
                { label: 'CEP', key: 'cep', value: cep, setter: setCep, keyboard: 'numeric' },
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
                  value={campo.key === 'cep' ? cep : (campo.value as string)}
                  onChangeText={(t) => {
                    if (campo.key === 'cep') {
                      setCep(t);
                      buscarEndereco(t);
                    } else {
                      setEndereco((p) => ({ ...p, [campo.key]: t }));
                    }
                  }}
                  keyboardType={(campo.keyboard as KeyboardTypeOptions) || 'default'}
                />
              ))}
            </>
          )}

          {/* Data e Hora */}
          <TouchableOpacity onPress={() => setMostrarData(true)}>
            <TextInput
              style={styles.input}
              placeholder="Data do agendamento"
              placeholderTextColor={themas.colors.secundaria}
              value={formatarDataBrasileira(data.toISOString().split('T')[0])}
              editable={false}
            />
          </TouchableOpacity>

          {mostrarData && (
            <DateTimePicker
              value={data}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, selectedDate) => {
                setMostrarData(false);
                if (selectedDate) setData(selectedDate);
              }}
            />
          )}

          <TouchableOpacity onPress={() => setMostrarHora(true)}>
            <TextInput
              style={styles.input}
              placeholder="Hora do agendamento"
              placeholderTextColor={themas.colors.secundaria}
              value={data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              editable={false}
            />
          </TouchableOpacity>

          {mostrarHora && (
            <DateTimePicker
              value={data}
              mode="time"
              is24Hour
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, selectedTime) => {
                setMostrarHora(false);
                if (selectedTime) setData(selectedTime);
              }}
            />
          )}

          {/* Descrição */}
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Descrição do local"
            placeholderTextColor={themas.colors.secundaria}
            value={descricao}
            onChangeText={setDescricao}
            multiline
          />

          {/* Botão de confirmar */}
          <TouchableOpacity style={styles.saveButton} onPress={confirmarAgendamento}>
            <Text style={styles.saveButtonText}>Confirmar agendamento</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lista de Agendamentos */}
      {loading ? (
        <Text style={styles.loadingText}>Carregando...</Text>
      ) : agendamentos.length > 0 ? (
        <FlatList
          data={agendamentos}
          keyExtractor={(ag) => String(ag.id)}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 8 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.cardAgendamento,
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 15,
                  paddingHorizontal: 12,
                  paddingBottom: 12,
                  marginBottom: 12,
                },
              ]}
            >
              <Text
                style={[
                  styles.cardTituloAgendamento,
                  { textAlign: 'center', marginBottom: 6 },
                ]}
              >
                {item.servicos?.titulo || `Serviço #${item.servico_id}`}
              </Text>

              {item.servicos?.tipo && (
                <Text
                  style={[
                    styles.cardDescricaoAgendamento,
                    {
                      color: themas.colors.primaria,
                      fontStyle: 'italic',
                      textAlign: 'center',
                      marginBottom: 4,
                    },
                  ]}
                >
                  Tipo:{' '}
                  {item.servicos.tipo.charAt(0).toUpperCase() + item.servicos.tipo.slice(1)}
                </Text>
              )}

              <Text
                style={[styles.cardDescricaoAgendamento, { textAlign: 'center', marginBottom: 4 }]}
              >
                Data: {formatarDataBrasileira(item.data_agendamento, item.hora_agendamento)} às{' '}
                {item.hora_agendamento?.slice(0, 5)}
              </Text>

              {item.enderecos && (
                <Text
                  style={[
                    styles.cardDescricao,
                    { textAlign: 'center', marginBottom: 4, color: themas.colors.primaria },
                  ]}
                >
                  Endereço:{' '}
                  {`${item.enderecos.rua}, ${item.enderecos.numero || 'S/N'} - ${item.enderecos.bairro}, ${item.enderecos.cidade}-${item.enderecos.estado}`}
                </Text>
              )}
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  {
                    backgroundColor: themas.colors.primaria,
                    marginTop: 6,
                    marginBottom: 0,
                  },
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
