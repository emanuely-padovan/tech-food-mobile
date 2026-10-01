// No celular, "localhost" não funciona: use o IP do PC na rede (ipconfig / ifconfig).
// Emulador Android: http://10.0.2.2:3000
export const BASE_URL = 'http://192.168.0.10:3000';

let token = null;
export const temToken = () => !!token;

export const moeda = (v) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`;
export const urlImagem = (img) => (img ? `${BASE_URL}${img}` : null); // API já devolve "/public/uploads/..."

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  const dados = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(dados.erro || dados.mensagem || `Erro ${res.status}`);
  return dados;
}

const json = (method, body) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

// Produtos (a API devolve { sucesso, dados, total })
export const buscarProdutos = async () => (await request('/produtos')).dados;
export const buscarProduto = async (id) => (await request(`/produtos/${id}`)).dados;

export const cadastrarProduto = (formData) =>
  request('/produtos', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }, // sem Content-Type: o RN define o multipart
    body: formData,
  });

// Auth
export async function login(email, senha) {
  const dados = await request('/auth/login', json('POST', { email, senha }));
  token = dados.token;
  return dados.usuario;
}

// Pedidos
export const criarPedido = (cliente, itens) => request('/pedidos', json('POST', { cliente, itens }));
export const buscarPedidos = () => request('/pedidos');
export const buscarPedido = (id) => request(`/pedidos/${id}`);
export const atualizarStatusPedido = (id, status) =>
  request(`/pedidos/${id}/status`, json('PATCH', { status }));
export const deletarPedido = (id) => request(`/pedidos/${id}`, { method: 'DELETE' });