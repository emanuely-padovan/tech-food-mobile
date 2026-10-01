import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { CarrinhoProvider, useCarrinho } from './src/context/CarrinhoContext';
import ListaProdutos from './src/screens/ListaProdutos';
import DetalheProduto from './src/screens/DetalheProduto';
import Carrinho from './src/screens/Carrinho';
import ListaDePedidos from './src/screens/ListaDePedidos';
import CadastroProduto from './src/screens/CadastroProduto';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const headerStyle = { headerStyle: { backgroundColor: '#e67e22' }, headerTintColor: '#fff' };

function CardapioStack() {
  return (
    <Stack.Navigator screenOptions={headerStyle}>
      <Stack.Screen name="ListaProdutos" component={ListaProdutos} options={{ title: 'TechFood - Cardápio' }} />
      <Stack.Screen name="DetalheProduto" component={DetalheProduto} options={{ title: 'Detalhes' }} />
    </Stack.Navigator>
  );
}

const icones = { Cardapio: 'restaurant', Carrinho: 'cart', Pedidos: 'receipt', Cadastrar: 'add-circle' };

function Tabs() {
  const { qtdTotal } = useCarrinho();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...headerStyle,
        tabBarActiveTintColor: '#e67e22',
        tabBarIcon: ({ color, size }) => <Ionicons name={icones[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="Cardapio" component={CardapioStack} options={{ headerShown: false, title: 'Cardápio' }} />
      <Tab.Screen name="Carrinho" component={Carrinho} options={{ tabBarBadge: qtdTotal || undefined }} />
      <Tab.Screen name="Pedidos" component={ListaDePedidos} options={{ title: 'Meus Pedidos' }} />
      <Tab.Screen name="Cadastrar" component={CadastroProduto} options={{ title: 'Cadastrar Prato' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <CarrinhoProvider>
      <NavigationContainer>
        <Tabs />
        <StatusBar style="light" />
      </NavigationContainer>
    </CarrinhoProvider>
  );
}