import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { styles } from './styles';
import { themas } from '../../global/themes';
import { supabase } from '../../config/supabase';

export default function HomeScreen() {
  const usuarioId = 1; 
  const [servicoAtual, setServicoAtual] = useState<any | null>(null);

  useEffect(() => {
    carregarServicoAtual();
  }, []);

  const carregarServicoAtual = async () => {
    const { data } = await supabase
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
      .eq('pedreiro_id', usuarioId)
      .in('status', ['aceito', 'em_andamento'])
      .limit(1);

    setServicoAtual(data && data.length > 0 ? data[0] : null);
  };

  const abrirRota = () => {
    if (!servicoAtual?.enderecos) return;

    const { rua, numero, bairro, cidade, estado } = servicoAtual.enderecos;
    const enderecoCompleto = `${rua}, ${numero} - ${bairro}, ${cidade} - ${estado}`;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      enderecoCompleto
    )}`;

    Linking.openURL(url);
  };

  const finalizarServico = async () => {
    if (!servicoAtual) return;

    const { error } = await supabase
      .from('agendamentos')
      .update({ status: 'concluido' })
      .eq('id', servicoAtual.id);

    if (!error) {
      Alert.alert('Serviço finalizado!');
      carregarServicoAtual();
    }
  };

  return (
    <View style={styles.containerCenter}>
      <Text style={styles.title}>Serviço em andamento</Text>

      {/* Nenhum serviço */}
      {!servicoAtual && (
        <View style={styles.centerCard}>
          <Text style={[styles.emptyText, { textAlign: 'center' }]}>
            Nenhum serviço em andamento,{'\n'}
            verifique sua fila de serviços.
          </Text>
        </View>
      )}

      {/* Serviço Atual */}
      {servicoAtual && (
        <View style={styles.centerCard}>
          <Text style={styles.cardTituloAgendamento}>
            {servicoAtual.servicos?.titulo || `Serviço #${servicoAtual.servico_id}`}
          </Text>

          {servicoAtual.servicos?.tipo && (
            <Text style={[styles.cardDescricaoAgendamento, { color: themas.colors.primaria }]}>
              Tipo:{' '}
              {servicoAtual.servicos.tipo.charAt(0).toUpperCase() +
                servicoAtual.servicos.tipo.slice(1)}
            </Text>
          )}

          <Text style={styles.cardDescricao}>Cliente: {servicoAtual.usuarios?.nome || '—'}</Text>
          <Text style={styles.cardDescricao}>Telefone: {servicoAtual.usuarios?.telefone || '—'}</Text>

          {servicoAtual.enderecos && (
            <Text style={[styles.cardDescricao, { color: themas.colors.primaria }]}>
              Endereço:{' '}
              {`${servicoAtual.enderecos.rua}, ${
                servicoAtual.enderecos.numero || 'S/N'
              } - ${servicoAtual.enderecos.bairro}, ${
                servicoAtual.enderecos.cidade
              }-${servicoAtual.enderecos.estado}`}
            </Text>
          )}

          {/* Botão Ver Rota */}
          <TouchableOpacity style={styles.saveButton} onPress={abrirRota}>
            <Text style={styles.saveButtonText}>Ver rota</Text>
          </TouchableOpacity>

          {/* Finalizar serviço */}
          {servicoAtual.status === 'em_andamento' && (
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: 'green' }]}
              onPress={finalizarServico}
            >
              <Text style={[styles.saveButtonText, { color: '#fff' }]}>Finalizar serviço</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
