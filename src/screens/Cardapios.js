import { useCallback, useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { buscarCardapios, buscarCardapio, moeda, urlImagem } from '../services/api';
import { useCarrinho } from '../context/CarrinhoContext';

export default function Cardapios() {
    const [cardapios, setCardapios] = useState([]);
    const [abertos, setAbertos] = useState({}); // id -> cardápio com produtos
    const { adicionar } = useCarrinho();

    const carregar = async () => {
        try {
            setCardapios(await buscarCardapios());
        } catch (e) {
            Alert.alert('Erro', e.message);
        }
    };
    useFocusEffect(useCallback(() => { carregar(); }, []));

    const alternar = async (id) => {
        if (abertos[id]) return setAbertos(({ [id]: _, ...resto }) => resto);
        try {
            setAbertos((a) => ({ ...a, [id]: buscarCardapio(id) }));
        } catch (e) {
            Alert.alert('Erro', e.message);
        }
    };

    return (
        <FlatList
            style={{ backgroundColor: '#f6f6f6' }}
            data={cardapios}
            keyExtractor={(c) => String(c.id)}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            refreshing={false}
            onRefresh={carregar}
            ListEmptyComponent={<Text style={styles.vazio}>Nenhum cardápio cadastrado.</Text>}
            renderItem={({ item }) => {
                const detalhe = abertos[item.id];
                return (
                    <Pressable style={styles.card} onPress={() => alternar(item.id)}>
                        <Text style={styles.titulo}>{item.nome}</Text>
                        {!!item.descricao && <Text style={styles.desc}>{item.descricao}</Text>}
                        {!item.disponivel && <Text style={styles.off}>Indisponível</Text>}

                        {detalhe?.produtos?.map((p) => {
                            const uri = urlImagem(p.imagem);
                            return (
                                <View key={p.id} style={styles.prod}>
                                    {uri ? <Image source={{ uri }} style={styles.img} /> : <View style={[styles.img, styles.semImg]} />}
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.nome}>{p.nome}</Text>
                                        <Text style={styles.preco}>{moeda(p.preco)}</Text>
                                    </View>
                                    <Pressable
                                        style={[styles.btn, !p.disponivel && { backgroundColor: '#bbb' }]}
                                        disabled={!p.disponivel}
                                        onPress={() => adicionar(p)}
                                    >
                                        <Text style={styles.btnTxt}>{p.disponivel ? '+ Pedir' : 'Indisp.'}</Text>
                                    </Pressable>
                                </View>
                            );
                        })}
                    </Pressable>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    vazio: { textAlign: 'center', color: '#777' },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 8, elevation: 2 },
    titulo: { fontWeight: '800', fontSize: 17 },
    desc: { color: '#666' },
    off: { color: '#c0392b', fontWeight: '600' },
    prod: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
    img: { width: 50, height: 50, borderRadius: 8 },
    semImg: { backgroundColor: '#eee' },
    nome: { fontWeight: '600' },
    preco: { color: '#e67e22', fontWeight: '700' },
    btn: { backgroundColor: '#e67e22', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
    btnTxt: { color: '#fff', fontWeight: '600' },
});