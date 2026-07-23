import { createContext, useContext, useState, useEffect } from 'react';
import { apiCRUD } from '../../utils/api'; 

const CartContext = createContext();

export function CartProvider({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // 1. Inicia o estado lendo o localStorage (se existir)
  const [cartItems, setCartItems] = useState(() => {
    const carrinhoGuardado = localStorage.getItem('mercearia_cart');
    if (carrinhoGuardado) {
      try {
        return JSON.parse(carrinhoGuardado);
      } catch (e) {
        console.error("Erro a ler o carrinho guardado", e);
        return [];
      }
    }
    return [];
  });

  // Função auxiliar para garantir que os preços são sempre números
  const parsePreco = (valor) => {
    if (valor === null || valor === undefined || valor === '') return 0;
    const limpo = String(valor).replace(',', '.').replace(/[^0-9.]/g, '');
    return Number(limpo) || 0;
  };

  // 2. O DETETIVE INVISÍVEL (Limpa Fantasmas E Atualiza Preços)
  useEffect(() => {
    const sincronizarCarrinho = async () => {
      if (cartItems.length === 0) return;

      try {
        // Vai buscar o catálogo atualizado
        const produtosServidor = await apiCRUD.read('/produtos');
        const arrayProdutos = Array.isArray(produtosServidor) ? produtosServidor : (produtosServidor?.data || []);
        
        setCartItems(prevCart => {
          let houveAlteracao = false;

          // Mapeia o carrinho e compara com o servidor
          const carrinhoSincronizado = prevCart.map(itemCart => {
            // Procura o item correspondente no servidor
            const produtoNoServidor = arrayProdutos.find(p => p.id === itemCart.id);
            
            // Se não encontrou no servidor (foi apagado), marcamos como null
            if (!produtoNoServidor) {
              houveAlteracao = true;
              return null;
            }

            // Calcula qual deveria ser o preço HOJE
            const precoNormalHoje = parsePreco(produtoNoServidor.product_cost);
            const precoDescontoHoje = parsePreco(produtoNoServidor.best_cost);
            const precoFinalHoje = (produtoNoServidor.best_cost && precoDescontoHoje > 0 && precoDescontoHoje < precoNormalHoje) 
              ? precoDescontoHoje 
              : precoNormalHoje;

            // Se o preço do carrinho estiver diferente do servidor, atualiza
            if (itemCart.precoFinal !== precoFinalHoje) {
              houveAlteracao = true;
              return { ...itemCart, precoFinal: precoFinalHoje }; // Atualiza o preço
            }

            // Se o preço estiver igual, mantém intocado
            return itemCart;
          }).filter(item => item !== null); // Remove os nulos (fantasmas apagados)

          // Só re-renderiza e grava se os preços/produtos tiverem mudado
          if (houveAlteracao) {
            console.log('Carrinho sincronizado com preços e stock atualizados do servidor!');
            return carrinhoSincronizado;
          }
          
          return prevCart;
        });

      } catch (error) {
        console.error("Erro ao sincronizar o carrinho com o servidor:", error);
      }
    };

    sincronizarCarrinho();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3. Grava no localStorage sempre que o carrinho mudar
  useEffect(() => {
    localStorage.setItem('mercearia_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev); 

  const addToCart = (produto, quantidade = 1) => {
    setCartItems(prev => {
      const itemExistente = prev.find(item => item.id === produto.id);
      
      const precoNormal = parsePreco(produto.product_cost);
      const precoDesconto = parsePreco(produto.best_cost);
      const precoFinal = (produto.best_cost && precoDesconto > 0 && precoDesconto < precoNormal) 
        ? precoDesconto 
        : precoNormal;

      if (itemExistente) {
        return prev.map(item => 
          item.id === produto.id 
            // Atualiza a quantidade e força o novo preço (caso já estivesse no carrinho com preço velho)
            ? { ...item, quantidade: item.quantidade + quantidade, precoFinal: precoFinal }
            : item
        );
      }
      
      return [...prev, { ...produto, quantidade, precoFinal }];
    });
    
    openCart(); 
  };

  const removeFromCart = (produtoId) => {
    setCartItems(prev => prev.filter(item => item.id !== produtoId));
  };

  const updateQuantity = (produtoId, novaQuantidade) => {
    const item = cartItems.find(i => i.id === produtoId);
    const minQty = Number(item?.product_min_quantity) || 1;

    if (novaQuantidade < minQty) return; 

    setCartItems(prev => prev.map(item => 
      item.id === produtoId ? { ...item, quantidade: novaQuantidade } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.length;

  const cartTotal = cartItems.reduce((total, item) => {
    const divisor = item.unit_type === 'kg' ? 1000 : 1;
    return total + ((item.precoFinal / divisor) * item.quantidade);
  }, 0);

  return (
    <CartContext.Provider value={{ 
      isCartOpen, openCart, closeCart, toggleCart,
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
      cartCount, cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);