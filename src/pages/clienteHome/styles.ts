import { StyleSheet } from 'react-native';
import { themas } from '../../global/themes';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  homeCliente: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: themas.colors.primaria,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: themas.colors.secundaria,
    marginBottom: 10,
    textAlign: 'center',
  },
  fotoPedreiro: {
    width: '100%',
    height: 500,
    borderRadius: 12,
    marginBottom: 15,
  },
  textBio: {
    fontSize: 16,
    color: themas.colors.secundaria,
    marginBottom: 10,
    textAlign: 'justify',
  },
  textBold: {
    fontWeight: '600',
    color: themas.colors.secundaria,
  },
  fotoProntidao: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 15,
  },
  titleObras: {
    fontSize: 18,
    fontWeight: '600',
    color: themas.colors.secundaria,
    marginBottom: 10,
    textAlign: 'center',
  },
  imgObra: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginRight: 10,
  },
  textFinal: {
    fontSize: 16,
    color: themas.colors.secundaria,
    marginTop: 20,
    textAlign: 'center',
  },
  boxButton: {
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: themas.colors.secundaria,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 80,
    width: '50%',
    alignItems: 'center',
  },
  buttonText: {
    color: themas.colors.primaria,
    fontWeight: 'bold',
    fontSize: 16,
  },
   containerServicos: {
    flex: 1,
    padding: 16,
    backgroundColor: themas.colors.primaria,
  },

  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: themas.colors.secundaria,
  },

  dropdown: {
    marginBottom: 20,
    backgroundColor: themas.colors.secundaria,
    borderColor: 'transparent',
  },

  dropdownContainer: {
    backgroundColor: themas.colors.secundaria,
    borderColor: 'transparent',
  },

  dropdownItem: {
    backgroundColor: themas.colors.secundaria,
  },

  dropdownLabel: {
    color: themas.colors.primaria,
    fontWeight: '600',
  },

  dropdownLabelSelecionado: {
    color: themas.colors.primaria,
    fontWeight: '900',
  },

  listaContainer: {
    paddingBottom: 60,
  },

  card: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
  },

  cardImagem: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 12,
  },

  cardTitulo: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    color: themas.colors.secundaria,
  },

  cardDescricao: {
    fontSize: 14,
    marginVertical: 5,
    textAlign: 'center',
    color: themas.colors.secundaria,
  },

  cardPreco: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    color: themas.colors.secundaria,
  },
});