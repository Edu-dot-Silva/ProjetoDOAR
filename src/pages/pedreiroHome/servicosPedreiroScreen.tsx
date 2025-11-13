import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { supabase } from '../../config/supabase';
import { themas } from '../../global/themes';
import { styles } from './styles';

export default function AgendamentosPedreiroScreen() {
  const usuarioId = 1; // depois substituir pelo auth

  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dropdown de STATUS
  const [open, setOpen] = useState(false);
  const [statusSelecionado, setStatusSelecionado] = useState<string>('pendente');

  const opcoesStatus = [
    { label: 'Pendentes', value: 'pendente' },
    { label: 'Aceitos', value: 'aceito' },
    { label: 'Finalizados', value: 'concluido' },
  ];

  useEffect(() => {
    carregarAgendamentos();
  }, [statusSelecionado]);

  const carregarAgendamentos = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        *,
        servicos (
          titulo,
          tipo
        ),
        usuarios (
          nome,
          telefone
        ),
        enderecos (
          rua,
          numero,
          bairro,
          cidade,
          estado
        )
      `)
      .eq('status', statusSelecionado);

    if (!error && data) {
      setAgendamentos(data);
    }

    setLoading(false);
  };

  const aceitarAgendamento = async (id: number) => {
    const { error } = await supabase
      .from('agendamentos')
      .update({
        status: 'aceito',
        pedreiro_id: usuarioId,
      })
      .eq('id', id);

    if (!error) {
      Alert.alert('Serviço aceito!');
      carregarAgendamentos();
    }
  };

  const finalizarAgendamento = async (id: number) => {
    const { error } = await supabase
      .from('agendamentos')
      .update({ status: 'concluido' })
      .eq('id', id);

    if (!error) {
      Alert.alert('Serviço finalizado!');
      carregarAgendamentos();
    }
  };

  const recusarAgendamento = async (id: number) => {
    Alert.alert('Recusar serviço', 'Deseja realmente recusar este agendamento?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('agendamentos').delete().eq('id', id);

          if (!error) {
            carregarAgendamentos();
          }
        },
      },
    ]);
  };

  const formatarData = (dataISO: string, hora?: string) => {
    const d = new Date(`${dataISO}T${hora || '00:00'}`);
    return d.toLocaleDateString('pt-BR');
  };

  return (
    <View style={styles.containerServicosPedreiro}>
      <Text style={styles.tituloPedreiro}>Agendamentos</Text>

      {/* Dropdown de STATUS */}
      <DropDownPicker
        open={open}
        value={statusSelecionado}
        items={opcoesStatus}
        setOpen={setOpen}
        setValue={setStatusSelecionado}
        setItems={() => {}}
        placeholder="Filtrar por status"
        zIndex={1000}
        style={styles.dropdownPedreiro}
        dropDownContainerStyle={styles.dropdownContainerPedreiro}
        listItemContainerStyle={styles.dropdownItemPedreiro}
        labelStyle={styles.dropdownLabel}
        selectedItemLabelStyle={styles.dropdownLabelSelecionadoPedreiro}
      />

      {/* Lista */}
      {loading ? (
        <Text style={styles.loadingTextPedreiro}>Carregando...</Text>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listaContainerPedreiro}
          ListEmptyComponent={() => (
            <Text style={styles.emptyTextPedreiro}>Nenhum serviço para este status.</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.cardPedreiro}>
              <Text style={styles.cardTituloPedreiro}>
                {item.servicos?.titulo || 'Serviço'}
              </Text>

              {item.servicos?.tipo && (
                <Text style={styles.cardDescricaoPedreiro}>
                  Tipo: {item.servicos.tipo}
                </Text>
              )}

              <Text style={styles.cardDescricaoPedreiro}>
                Cliente: {item.usuarios?.nome || '—'}
              </Text>

              <Text style={styles.cardDescricaoPedreiro}>
                Telefone: {item.usuarios?.telefone || '—'}
              </Text>

              <Text style={styles.cardDescricaoPedreiro}>
                Data: {formatarData(item.data_agendamento, item.hora_agendamento)} às{' '}
                {item.hora_agendamento?.slice(0, 5)}
              </Text>

              {item.enderecos && (
                <Text style={[styles.cardDescricaoPedreiro, { color: themas.colors.primaria }]}>
                  Endereço: {item.enderecos.rua}, {item.enderecos.numero || 'S/N'} -{' '}
                  {item.enderecos.bairro}, {item.enderecos.cidade}-{item.enderecos.estado}
                </Text>
              )}

              {/* Botões */}
              {statusSelecionado === 'pendente' && (
                <>
                  <TouchableOpacity
                    style={[styles.saveButtonPedreiro, { backgroundColor: themas.colors.secundaria }]}
                    onPress={() => aceitarAgendamento(item.id)}
                  >
                    <Text style={[styles.saveButtonTextPedreiro, { color: themas.colors.primaria }]}>
                      Aceitar serviço
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.saveButtonPedreiro, { backgroundColor: '#b60000' }]}
                    onPress={() => recusarAgendamento(item.id)}
                  >
                    <Text style={[styles.saveButtonTextPedreiro, { color: '#fff' }]}>
                      Recusar serviço
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {statusSelecionado === 'aceito' && (
                <TouchableOpacity
                  style={[styles.saveButtonPedreiro, { backgroundColor: 'green' }]}
                  onPress={() => finalizarAgendamento(item.id)}
                >
                  <Text style={[styles.saveButtonTextPedreiro, { color: '#fff' }]}>
                    Finalizar serviço
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}
