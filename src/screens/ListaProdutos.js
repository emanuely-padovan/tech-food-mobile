import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CardProduto from '../components/CardProduto';
import { buscarProdutos } from '../services/api';
import { useCarrinho } from '../context/CarrinhoContext';

export default function ListaProdutos({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const { adicionar } = useCarrinho();

  const carregar = async () => {
    try {
      setErro(null);
      setProdutos(await buscarProdutos());
    } catch (e) {
      setErro('Erro ao carregar o cardápio. Verifique se o servidor está rodando.');
    } finally {
      setCarregando(false);
    }
  };

  useFocusEffect(useCallback(() => { carregar(); }, []));

  if (carregando) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#e67e22" />;

  return (
    <View style={styles.container}>
      {erro && <Text style={styles.erro}>{erro}</Text>}
      <FlatList
        data={produtos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CardProduto
            produto={item}
            onPress={(id) => navigation.navigate('DetalheProduto', { produtoId: id })}
            onAdd={adicionar}
          />
        )}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        refreshing={false}
        onRefresh={carregar}
        ListEmptyComponent={!erro && <Text>Nenhum produto carregado ainda.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6' },
  lista: { padding: 16, gap: 12 },
  erro: { color: '#c0392b', textAlign: 'center', padding: 12 },
});