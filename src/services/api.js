// No celular, "localhost" não funciona: use o IP do PC na rede (ipconfig / ifconfig).
// Emulador Android: http://10.0.2.2:3000
// Opcional: crie um .env com EXPO_PUBLIC_API_URL=http://SEU_IP:3000
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.10:3000';

let token = null;
export const temToken = () => !!token;
export const sair = () => { token = null; };

export const moeda = (v) => `R$ ${Number(v || 0).toFixed(2).replace('.', ',')}`;
export const urlImagem = (img) =>
  !img ? null : `${BASE_URL}${img.startsWith('/public/') ? img : `/public/${img.replace(/^\//, '')}`}`;

const mensagemDe = (d, status) =>
  (typeof d.mensagem === 'string' && d.mensagem) ||
  (typeof d.erro === 'string' && d.erro) ||
  `Erro ${status}`;

async function request(path, options = {}) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    let res;
    try {
        res = await fetch(`${BASE_URL}${path}`, { ...options, signal: ctrl.signal });
    } catch (e) {
        throw new Error(
            e.name === 'AbortError'
                ? 'Tempo esgotado ao falar com o servidor.'
                : `Não foi possível conectar em ${BASE_URL}. Verifique o IP e a rede.`
        );
    } finally {
        clearTimeout(timer);
    }
    const dados = await res.json().catch(() => ({}));
    if (!res.ok) {
        const err = new Error(mensagemDe(dados, res.status));
        err.status = res.status;
        throw err;
    }
    return dados;
}

const json = (method, body) => ({
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
});

// A API devolve { sucesso, dados, total }; aceitamos também array/objeto direto
const lista = (r) => (Array.isArray(r) ? r : r?.dados ?? []);
const objeto = (r) => r?.dados ?? r;

// Produtos
export const buscarProdutos = async () => lista(await request('/produtos'));
export const buscarProduto = async (id) => objeto(await request(`/produtos/${id}`));

export const cadastrarProduto = (formData) =>
    request('/produtos', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }, // sem Content-Type: o RN define o multipart
        body: formData,
    });

// Auth
export async function login(email, senha) {
    const r = await request('/auth/login', json('POST', { email, senha }));
    token = r.token ?? r.dados?.token ?? null;
    if (!token) throw new Error('Login sem token na resposta da API.');
    return r.usuario ?? r.dados?.usuario ?? {};
}

// Pedidos
export const criarPedido = (cliente, itens) => request('/pedidos', json('POST', { cliente, itens }));
export const buscarPedidos = async () => lista(await request('/pedidos'));
export const buscarPedido = async (id) => objeto(await request(`/pedidos/${id}`));
export const atualizarStatusPedido = (id, status) =>
    request(`/pedidos/${id}/status`, json('PATCH', { status }));
export const deletarPedido = (id) => request(`/pedidos/${id}`, { method: 'DELETE' });

// Cardápios
export const buscarCardapios = async () => lista(await request('/cardapios'));
export const buscarCardapio = async (id) => objeto(await request(`/cardapios/${id}`));