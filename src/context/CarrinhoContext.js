import { createContext, useContext, useState } from 'react';

const CarrinhoContext = createContext();
export const useCarrinho = () => useContext(CarrinhoContext);

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]); // [{ produto, quantidade }]

  const adicionar = (produto, quantidade = 1) =>
    setItens((atual) => {
      const existe = atual.find((i) => i.produto.id === produto.id);
      if (existe) {
        return atual.map((i) =>
          i.produto.id === produto.id ? { ...i, quantidade: i.quantidade + quantidade } : i
        );
      }
      return [...atual, { produto, quantidade }];
    });

  const alterar = (id, delta) =>
    setItens((atual) =>
      atual
        .map((i) => (i.produto.id === id ? { ...i, quantidade: i.quantidade + delta } : i))
        .filter((i) => i.quantidade > 0)
    );

  const limpar = () => setItens([]);

  const total = itens.reduce((s, i) => s + Number(i.produto.preco) * i.quantidade, 0);
  const qtdTotal = itens.reduce((s, i) => s + i.quantidade, 0);

  return (
    <CarrinhoContext.Provider value={{ itens, adicionar, alterar, limpar, total, qtdTotal }}>
      {children}
    </CarrinhoContext.Provider>
  );
}