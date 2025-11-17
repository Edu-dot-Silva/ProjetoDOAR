import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Linking } from 'react-native';
import { supabase } from '../../config/supabase';
import { themas } from '../../global/themes';
import { styles } from './styles';

export default function AgendamentosPedreiroScreen() {
  const usuarioId = 1; // depois substituir pelo auth

  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAgendamentos();
  }, []);

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
      .eq('status', 'pendente'); // só mostra pendentes

    if (!error && data) {
      setAgendamentos(data);
    }

    setLoading(false);
  };

  // 👉 ABRIR WHATSAPP + deletar do banco + remover da lista
  const abrirWhatsapp = async (item: any) => {
    const telefone = item.usuarios?.telefone?.replace(/\D/g, '');

    if (!telefone) {
      Alert.alert('Erro', 'O cliente não possui telefone cadastrado.');
      return;
    }

    const mensagem = `Olá ${item.usuarios.nome}, vi seu pedido de serviço "${item.servicos?.titulo}". Podemos conversar?`;
    const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;

    // Abre WhatsApp
    Linking.openURL(url).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
    });

    // 👉 1) REMOVE IMEDIATAMENTE DA LISTA VISUAL
    setAgendamentos((current) => current.filter((a) => a.id !== item.id));

    // 👉 2) EXCLUI DO BANCO DEFINITIVAMENTE
    const { error } = await supabase
      .from('agendamentos')
      .delete()
      .eq('id', item.id);

    if (error) {
      Alert.alert('Erro', 'Não foi possível remover o agendamento do banco.');
      console.log(error);
    }
  };

  const formatarData = (dataISO: string, hora?: string) => {
    const d = new Date(`${dataISO}T${hora || '00:00'}`);
    return d.toLocaleDateString('pt-BR');
  };

  return (
    <View style={styles.containerServicosPedreiro}>
      <Text style={styles.tituloPedreiro}>Agendamentos</Text>

      {/* Lista */}
      {loading ? (
        <Text style={styles.loadingTextPedreiro}>Carregando...</Text>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listaContainerPedreiro}
          ListEmptyComponent={() => (
            <Text style={styles.emptyTextPedreiro}>
              Nenhum agendamento disponível no momento.
            </Text>
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

              {/* 👉 Botão ÚNICO: Entrar em contato */}
              <TouchableOpacity
                style={[styles.saveButtonPedreiro, { backgroundColor: '#25D366' }]}
                onPress={() => abrirWhatsapp(item)}
              >
                <Text style={[styles.saveButtonTextPedreiro, { color: '#fff' }]}>
                  Entrar em contato
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
