import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { moeda, urlImagem } from '../services/api';

export default function CardProduto({ produto, onPress, onAdd }) {
  const uri = urlImagem(produto.imagem);
  const disponivel = !!produto.disponivel;

  return (
    <Pressable style={styles.card} onPress={() => onPress(produto.id)}>
      {uri ? (
        <Image source={{ uri }} style={styles.img} />
      ) : (
        <View style={[styles.img, styles.semImg]}><Text style={{ fontSize: 28 }}>🍽️</Text></View>
      )}
      <View style={styles.info}>
        <Text style={styles.nome}>{produto.nome}</Text>
        <Text style={styles.desc} numberOfLines={2}>{produto.descricao}</Text>
        <View style={styles.rodape}>
          <Text style={styles.preco}>{moeda(produto.preco)}</Text>
          <Pressable
            style={[styles.btn, !disponivel && styles.btnOff]}
            disabled={!disponivel}
            onPress={() => onAdd(produto)}
          >
            <Text style={styles.btnTxt}>{disponivel ? '+ Pedir' : 'Indisponível'}</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', elevation: 2 },
  img: { width: 100, height: 100 },
  semImg: { backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, padding: 10, justifyContent: 'space-between' },
  nome: { fontSize: 16, fontWeight: '700' },
  desc: { color: '#666', fontSize: 13 },
  rodape: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  preco: { color: '#e67e22', fontWeight: '700', fontSize: 16 },
  btn: { backgroundColor: '#e67e22', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  btnOff: { backgroundColor: '#bbb' },
  btnTxt: { color: '#fff', fontWeight: '600' },
});