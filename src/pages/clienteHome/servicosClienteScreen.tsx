import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import ImageViewing from 'react-native-image-viewing';
import { supabase } from '../../config/supabase';
import { themas } from '../../global/themes';
import { styles } from './styles';

export default function ServicosScreen() {
  const [servicos, setServicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [opcoes, setOpcoes] = useState<any[]>([
    { label: 'Todos os tipos', value: null },
    { label: 'Residencial', value: 'residencial' },
    { label: 'Comercial', value: 'comercial' },
    { label: 'Acabamento', value: 'acabamento' },
    { label: 'Estrutura', value: 'estrutura' },
  ]);

  const carregarServicos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('servicos').select('*').eq('ativo', true);

    if (!error && data) {
      setServicos(data);
    } else {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarServicos();
  }, []);

  const abrirImagem = (url: string) => {
    setSelectedImage(url);
    setIsVisible(true);
  };

  const servicosFiltrados = tipoSelecionado
    ? servicos.filter((s) => s.tipo === tipoSelecionado)
    : servicos;

  return (
    <View style={styles.containerServicos}>
      <Text style={styles.titulo}>Meus Serviços Disponíveis</Text>

      {/* Dropdown de filtro por tipo */}
      <DropDownPicker
        open={open}
        value={tipoSelecionado}
        items={opcoes}
        setOpen={setOpen}
        setValue={setTipoSelecionado}
        setItems={setOpcoes}
        placeholder="Filtrar por tipo de serviço"
        zIndex={1000}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        listItemContainerStyle={styles.dropdownItem}
        labelStyle={styles.dropdownLabel}
        selectedItemLabelStyle={styles.dropdownLabelSelecionado}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <FlatList
          data={servicosFiltrados}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listaContainer}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity onPress={() => abrirImagem(item.imagem_url)}>
                <Image source={{ uri: item.imagem_url }} style={styles.cardImagem} resizeMode="cover" />
              </TouchableOpacity>

              <Text style={styles.cardTitulo}>{item.titulo}</Text>
              <Text style={styles.cardDescricao}>{item.descricao}</Text>
              <Text style={styles.cardPreco}>R$ {item.preco_medio.toFixed(2)} / m²</Text>
            </View>
          )}
        />
      )}

      {/* Modal de imagem com zoom */}
      <ImageViewing
        images={selectedImage ? [{ uri: selectedImage }] : []}
        imageIndex={0}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
      />
    </View>
  );
}
