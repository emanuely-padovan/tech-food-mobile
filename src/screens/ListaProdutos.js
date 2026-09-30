import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function ListaProdutos() {
    return (
        <View style={styles.container}>
            <FlatList
                data={produtos}
                keyExtractor={(item) => String(item.id)}
                renderItem={({item}) => (
                    <CardProduto
                        produto={item}
                        onPress={(id) => navigation.navigate('DetalheProduto', {produtoId: id})}
                    />
                )}
                contentContainerStyle={styles.lista}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text>Nenhum produto carregado ainda.</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    lista: {
        padding: 16,
        gap: 12,
    },
});