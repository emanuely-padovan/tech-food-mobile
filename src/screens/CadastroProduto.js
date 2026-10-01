import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { cadastrarProduto, login, temToken } from '../services/api';

const CATEGORIAS = ['Massa', 'Pizza', 'Bebida'];

export default function CadastroProduto() {
  const [logado, setLogado] = useState(temToken());
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState('');
  const [disponivel, setDisponivel] = useState(true);
  const [foto, setFoto] = useState(null);

  const entrar = async () => {
    try {
      const usuario = await login(email.trim(), senha);
      if (usuario.papel !== 'admin') return Alert.alert('Acesso restrito', 'Somente administradores cadastram pratos.');
      setLogado(true);
    } catch (e) {
      Alert.alert('Erro no login', e.message);
    }
  };

  const escolherFoto = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!r.canceled) setFoto(r.assets[0]);
  };

  const salvar = async () => {
    if (!nome || !descricao || !preco) return Alert.alert('Atenção', 'Preencha nome, descrição e preço.');
    const form = new FormData();
    form.append('nome', nome);
    form.append('descricao', descricao);
    form.append('categoria', categoria);
    form.append('preco', preco.replace(',', '.'));
    form.append('disponivel', String(disponivel));
    if (foto) {
      form.append('imagem', {
        uri: foto.uri,
        name: foto.fileName || 'produto.jpg',
        type: foto.mimeType || 'image/jpeg', // a API aceita só JPEG/PNG
      });
    }
    try {
      await cadastrarProduto(form);
      Alert.alert('Sucesso', 'Produto cadastrado!');
      setNome(''); setDescricao(''); setCategoria(''); setPreco(''); setFoto(null); setDisponivel(true);
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  };

  if (!logado) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Login do administrador</Text>
        <TextInput style={styles.input} placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />
        <Pressable style={styles.btn} onPress={entrar}><Text style={styles.btnTxt}>Entrar</Text></Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Cadastro de Produto</Text>
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={[styles.input, { height: 80 }]} placeholder="Descrição" multiline value={descricao} onChangeText={setDescricao} />
      <TextInput style={styles.input} placeholder="Preço (ex: 35,50)" keyboardType="decimal-pad" value={preco} onChangeText={setPreco} />

      <View style={styles.chips}>
        {CATEGORIAS.map((c) => (
          <Pressable key={c} style={[styles.chip, categoria === c && styles.chipOn]} onPress={() => setCategoria(c)}>
            <Text style={categoria === c && { color: '#fff' }}>{c}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.linha}>
        <Text>Disponível?</Text>
        <Switch value={disponivel} onValueChange={setDisponivel} trackColor={{ true: '#e67e22' }} />
      </View>

      <Pressable style={[styles.btn, styles.btnSec]} onPress={escolherFoto}>
        <Text style={[styles.btnTxt, { color: '#e67e22' }]}>{foto ? 'Trocar imagem' : 'Escolher imagem'}</Text>
      </Pressable>
      {foto && <Image source={{ uri: foto.uri }} style={styles.preview} />}

      <Pressable style={styles.btn} onPress={salvar}><Text style={styles.btnTxt}>Cadastrar</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  titulo: { fontSize: 20, fontWeight: '800' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, backgroundColor: '#fff' },
  chips: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ddd' },
  chipOn: { backgroundColor: '#e67e22', borderColor: '#e67e22' },
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  preview: { width: '100%', height: 180, borderRadius: 12 },
  btn: { backgroundColor: '#e67e22', padding: 14, borderRadius: 10, alignItems: 'center' },
  btnSec: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e67e22' },
  btnTxt: { color: '#fff', fontWeight: '700' },
});