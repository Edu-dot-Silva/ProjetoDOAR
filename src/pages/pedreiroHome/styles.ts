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
  containerPerfil: {
    flex: 1,
    backgroundColor: themas.colors.primaria,
  },
  scrollContentPerfil: {
    padding: 20,
  },
  centerContentPerfil: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: themas.colors.secundaria,
    fontSize: 18,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: themas.colors.secundaria,
    backgroundColor: themas.colors.secundaria,
    marginBottom: 10,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: themas.colors.secundaria,
  },
  profileEmail: {
    color: themas.colors.secundaria,
    fontSize: 16,
  },
  profilePhone: {
    color: themas.colors.secundaria,
    fontSize: 16,
  },
  editButton: {
    alignSelf: 'center',
    backgroundColor: themas.colors.secundaria,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  editButtonText: {
    color: themas.colors.primaria,
    fontWeight: 'bold',
  },
  editSection: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: themas.colors.primaria,
    padding: 10,
    marginVertical: 6,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderColor: themas.colors.secundaria,
    color: themas.colors.secundaria,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: themas.colors.secundaria,
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 80,
  },
  saveButtonText: {
    color: themas.colors.secundaria,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: themas.colors.secundaria,
    marginBottom: 10,
  },
  listItem: {
    color: themas.colors.secundaria,
    marginBottom: 5,
  },
  emptyText: {
    color: themas.colors.primaria,
    fontStyle: 'italic',
    textAlign: 'center',
  },
iconTitle: {
  flexDirection: 'row',
  alignItems: 'center',        
  justifyContent: 'center',   
  marginBottom: 8,
},
icon: {
  width: 28,                  
  height: 28,
  marginRight: 8,
  resizeMode: 'contain',     
},
sectionTitlePerfil: {
  fontSize: 18,
  fontWeight: 'bold',
  color: themas.colors.secundaria,
  textAlignVertical: 'center',
},
loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: themas.colors.primaria, 
},
loadingTextPerfil: {
  color: themas.colors.secundaria, 
  fontSize: 18,
  fontWeight: 'bold',
},

cardAgendamento: {
  backgroundColor: themas.colors.secundaria,
  borderRadius: 10,
  padding: 12,
  marginBottom: 12,
},
cardTituloAgendamento: {
  fontSize: 16,
  fontWeight: 'bold',
  color: themas.colors.primaria,
},
cardDescricaoAgendamento: {
  color: themas.colors.primaria,
},
subtitulo: {
  fontSize: 18,
  fontWeight: 'bold',
  color: themas.colors.secundaria,
  marginTop: 20,
  marginBottom: 10,
  textAlign: 'center',
},
  inputPlaceholder: {
    color: themas.colors.secundaria,
    opacity: 0.8, // um leve contraste
  },


  //Css oficial
  containerCenter: {
  flex: 1,
  backgroundColor: themas.colors.primaria,
  paddingHorizontal: 20,
  justifyContent: 'center',
  alignItems: 'center',
},

centerCard: {
  width: '90%',
  backgroundColor: themas.colors.secundaria,
  padding: 20,
  borderRadius: 12,
  elevation: 4,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 6,
  alignItems: 'center',
  justifyContent: 'center',
},
 containerServicosPedreiro: {
    flex: 1,
    backgroundColor: themas.colors.primaria,
    padding: 16,
  },

  tituloPedreiro: {
    fontSize: 22,
    fontWeight: '700',
    color: themas.colors.secundaria,
    textAlign: 'center',
    marginBottom: 16,
  },

  loadingTextPedreiro: {
    color: themas.colors.secundaria,
    textAlign: 'center',
    marginTop: 20,
  },

  emptyTextPedreiro: {
    color: themas.colors.secundaria,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },

  // Dropdown
  dropdownPedreiro: {
    backgroundColor: themas.colors.secundaria,
    borderColor: themas.colors.primaria,
    marginBottom: 12,
  },

  dropdownContainerPedreiro: {
    backgroundColor: themas.colors.secundaria,
    borderColor: themas.colors.primaria,
  },

  dropdownItemPedreiro: {
    paddingVertical: 10,
  },

  dropdownLabelPedreiro: {
    color: themas.colors.primaria,
    fontWeight: '500',
  },

  dropdownLabelSelecionadoPedreiro: {
    color: themas.colors.primaria,
    fontWeight: '700',
  },

  listaContainerPedreiro: {
    paddingBottom: 30,
  },

  cardPedreiro: {
    backgroundColor: themas.colors.secundaria,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
  },

  cardTituloPedreiro: {
    fontSize: 16,
    fontWeight: '700',
    color: themas.colors.primaria,
    marginBottom: 6,
  },

  cardDescricaoPedreiro: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },

  saveButtonPedreiro: {
    backgroundColor: themas.colors.primaria,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },

  saveButtonTextPedreiro: {
    textAlign: 'center',
    color: themas.colors.secundaria,
    fontWeight: '700',
    fontSize: 14,
  },


});