import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { atualizarStatusPedido, buscarPedido, buscarPedidos, deletarPedido, moeda } from '../services/api';

const PROXIMO = {
  pendente: { label: '▶ Iniciar preparo', status: 'preparo' },
  preparo: { label: '✓ Marcar como pronto', status: 'pronto' },
  pronto: { label: '🛵 Marcar entregue', status: 'entregue' },
};
const COR = { pendente: '#f39c12', preparo: '#3498db', pronto: '#27ae60', entregue: '#7f8c8d' };

export default function ListaDePedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [abertos, setAbertos] = useState({}); // id -> pedido com itens

  const carregar = async () => {
    try {
      setPedidos(await buscarPedidos());
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  };

  useFocusEffect(useCallback(() => { carregar(); }, []));

  const alternar = async (id) => {
    if (abertos[id]) return setAbertos(({ [id]: _, ...resto }) => resto);
    try {
      const detalhe = await buscarPedido(id);
      setAbertos((a) => ({ ...a, [id]: detalhe }));
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  };

  const avancar = async (id, status) => {
    try {
      await atualizarStatusPedido(id, status);
      carregar();
    } catch (e) {
      Alert.alert('Erro ao atualizar status', e.message);
    }
  };

  const excluir = (id) =>
    Alert.alert('Cancelar pedido', `Excluir o pedido #${id}?`, [
      { text: 'Não' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try { await deletarPedido(id); carregar(); } catch (e) { Alert.alert('Erro', e.message); }
        },
      },
    ]);

  return (
    <FlatList
      style={{ backgroundColor: '#f6f6f6' }}
      data={pedidos}
      keyExtractor={(p) => String(p.id)}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      refreshing={false}
      onRefresh={carregar}
      ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#777' }}>Nenhum pedido ainda.</Text>}
      renderItem={({ item }) => {
        const proximo = PROXIMO[item.status];
        const detalhe = abertos[item.id];
        return (
          <Pressable style={styles.card} onPress={() => alternar(item.id)}>
            <View style={styles.topo}>
              <Text style={styles.titulo}>#{item.id} · {item.cliente || 'Cliente'}</Text>
              <Text style={[styles.status, { backgroundColor: COR[item.status] }]}>{item.status}</Text>
            </View>
            <Text style={styles.total}>{moeda(item.total)}</Text>

            {detalhe?.itens?.map((i) => (
              <Text key={i.id} style={styles.linha}>
                {i.quantidade}x {i.produto_nome} — {moeda(i.preco_unitario * i.quantidade)}
              </Text>
            ))}

            <View style={styles.acoes}>
              {proximo ? (
                <Pressable style={styles.btn} onPress={() => avancar(item.id, proximo.status)}>
                  <Text style={styles.btnTxt}>{proximo.label}</Text>
                </Pressable>
              ) : (
                <Text style={{ color: '#27ae60', fontWeight: '700' }}>✓ Concluído</Text>
              )}
              <Pressable onPress={() => excluir(item.id)}>
                <Text style={{ color: '#c0392b', fontWeight: '700' }}>Excluir</Text>
              </Pressable>
            </View>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 6, elevation: 2 },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { fontWeight: '700', fontSize: 16 },
  status: { color: '#fff', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, overflow: 'hidden', fontWeight: '600' },
  total: { color: '#e67e22', fontWeight: '700', fontSize: 16 },
  linha: { color: '#555' },
  acoes: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  btn: { backgroundColor: '#e67e22', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  btnTxt: { color: '#fff', fontWeight: '600' },
});