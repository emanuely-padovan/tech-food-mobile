import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useCarrinho } from '../context/CarrinhoContext';
import { criarPedido, moeda } from '../services/api';

export default function Carrinho({ navigation }) {
  const { itens, alterar, limpar, total } = useCarrinho();
  const [cliente, setCliente] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = async () => {
    if (!cliente.trim()) return Alert.alert('Atenção', 'Informe seu nome.');
    setEnviando(true);
    try {
      // o back-end calcula preço e total; enviamos só produto_id e quantidade
      await criarPedido(
        cliente.trim(),
        itens.map((i) => ({ produto_id: i.produto.id, quantidade: i.quantidade }))
      );
      limpar();
      Alert.alert('Pronto!', 'Pedido enviado para a cozinha 🍳');
      navigation.navigate('Pedidos');
    } catch (e) {
      Alert.alert('Erro ao enviar', e.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={itens}
        keyExtractor={(i) => String(i.produto.id)}
        contentContainerStyle={{ gap: 10, padding: 16 }}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum item ainda. Volte ao cardápio 😊</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nome}>{item.produto.nome}</Text>
              <Text style={styles.sub}>{moeda(Number(item.produto.preco) * item.quantidade)}</Text>
            </View>
            <Pressable style={styles.qBtn} onPress={() => alterar(item.produto.id, -1)}>
              <Text style={styles.qTxt}>-</Text>
            </Pressable>
            <Text style={styles.qVal}>{item.quantidade}</Text>
            <Pressable style={styles.qBtn} onPress={() => alterar(item.produto.id, 1)}>
              <Text style={styles.qTxt}>+</Text>
            </Pressable>
          </View>
        )}
      />

      {itens.length > 0 && (
        <View style={styles.rodape}>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            value={cliente}
            onChangeText={setCliente}
            maxLength={30}
          />
          <Text style={styles.total}>Total: {moeda(total)}</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable style={[styles.btn, styles.btnSec]} onPress={limpar}>
              <Text style={[styles.btnTxt, { color: '#c0392b' }]}>Limpar</Text>
            </Pressable>
            <Pressable style={[styles.btn, { flex: 1 }]} onPress={enviar} disabled={enviando}>
              <Text style={styles.btnTxt}>{enviando ? 'Enviando...' : '🍳 Enviar para Cozinha'}</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6' },
  vazio: { textAlign: 'center', marginTop: 40, color: '#777' },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12, gap: 10 },
  nome: { fontWeight: '700', fontSize: 15 },
  sub: { color: '#e67e22' },
  qBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' },
  qTxt: { fontSize: 18, fontWeight: '700' },
  qVal: { fontWeight: '700', minWidth: 20, textAlign: 'center' },
  rodape: { backgroundColor: '#fff', padding: 16, gap: 10, borderTopWidth: 1, borderColor: '#eee' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 },
  total: { fontSize: 18, fontWeight: '800' },
  btn: { backgroundColor: '#e67e22', padding: 14, borderRadius: 10, alignItems: 'center' },
  btnSec: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#c0392b' },
  btnTxt: { color: '#fff', fontWeight: '700' },
});