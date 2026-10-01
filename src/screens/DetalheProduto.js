import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { buscarProduto, moeda, urlImagem } from '../services/api';
import { useCarrinho } from '../context/CarrinhoContext';

export default function DetalheProduto({ route, navigation }) {
  const { produtoId } = route.params;
  const [produto, setProduto] = useState(null);
  const [qtd, setQtd] = useState(1);
  const { adicionar } = useCarrinho();

  useEffect(() => {
    buscarProduto(produtoId)
      .then(setProduto)
      .catch((e) => Alert.alert('Erro', e.message));
  }, [produtoId]);

  if (!produto) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#e67e22" />;

  const uri = urlImagem(produto.imagem);

  return (
    <ScrollView style={styles.container}>
      {uri && <Image source={{ uri }} style={styles.img} />}
      <View style={styles.corpo}>
        <Text style={styles.nome}>{produto.nome}</Text>
        {!!produto.categoria && <Text style={styles.cat}>{produto.categoria}</Text>}
        <Text style={styles.desc}>{produto.descricao}</Text>
        <Text style={styles.preco}>{moeda(Number(produto.preco) * qtd)}</Text>

        <View style={styles.qtdBox}>
          <Pressable style={styles.qtdBtn} onPress={() => setQtd(Math.max(1, qtd - 1))}>
            <Text style={styles.qtdTxt}>-</Text>
          </Pressable>
          <Text style={styles.qtdValor}>{qtd}</Text>
          <Pressable style={styles.qtdBtn} onPress={() => setQtd(qtd + 1)}>
            <Text style={styles.qtdTxt}>+</Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.add, !produto.disponivel && { backgroundColor: '#bbb' }]}
          disabled={!produto.disponivel}
          onPress={() => {
            adicionar(produto, qtd);
            navigation.goBack();
          }}
        >
          <Text style={styles.addTxt}>{produto.disponivel ? 'Adicionar ao pedido' : 'Indisponível'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  img: { width: '100%', height: 240 },
  corpo: { padding: 16, gap: 10 },
  nome: { fontSize: 24, fontWeight: '800' },
  cat: { color: '#e67e22', fontWeight: '600' },
  desc: { color: '#555', fontSize: 15 },
  preco: { fontSize: 22, fontWeight: '700', color: '#e67e22' },
  qtdBox: { flexDirection: 'row', alignItems: 'center', gap: 16, alignSelf: 'center' },
  qtdBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' },
  qtdTxt: { fontSize: 22, fontWeight: '700' },
  qtdValor: { fontSize: 20, fontWeight: '700', minWidth: 30, textAlign: 'center' },
  add: { backgroundColor: '#e67e22', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  addTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
});