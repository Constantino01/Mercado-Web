import { createContext, useContext, useState, useEffect } from 'react';

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

  // 2. Grava no localStorage sempre que o carrinho mudar
  useEffect(() => {
    localStorage.setItem('mercearia_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev); 

  const parsePreco = (valor) => {
    if (valor === null || valor === undefined || valor === '') return 0;
    const limpo = String(valor).replace(',', '.').replace(/[^0-9.]/g, '');
    return Number(limpo) || 0;
  };

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
            ? { ...item, quantidade: item.quantidade + quantidade }
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