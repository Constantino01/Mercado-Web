import { createContext, useContext, useState, useEffect } from 'react';
import { apiCRUD } from '../../utils/api'; 

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  // 1. Carrega o que está na memória
  const [favoritos, setFavoritos] = useState(() => {
    const salvos = localStorage.getItem('favoritos');
    return salvos ? JSON.parse(salvos) : [];
  });

  // 2. O DETETIVE INVISÍVEL (Limpa Fantasmas E Atualiza Dados/Preços)
  useEffect(() => {
    const sincronizarFavoritos = async () => {
      if (favoritos.length === 0) return; 

      try {
        const produtosServidor = await apiCRUD.read('/produtos');
        const arrayProdutos = Array.isArray(produtosServidor) ? produtosServidor : (produtosServidor?.data || []);
        
        setFavoritos(prev => {
          let houveAlteracao = false;

          const favoritosSincronizados = prev.map(itemFav => {
            const produtoNoServidor = arrayProdutos.find(p => p.id === itemFav.id);

            // Se não encontrou no servidor (foi apagado), marcamos como null
            if (!produtoNoServidor) {
              houveAlteracao = true;
              return null;
            }

            // Verifica se houve mudanças em campos importantes (preços, nome, imagem)
            if (
              itemFav.product_cost !== produtoNoServidor.product_cost ||
              itemFav.best_cost !== produtoNoServidor.best_cost ||
              itemFav.product_name !== produtoNoServidor.product_name ||
              itemFav.product_image !== produtoNoServidor.product_image
            ) {
              houveAlteracao = true;
              return produtoNoServidor; // Substitui pelo objeto atualizado
            }

            return itemFav;
          }).filter(item => item !== null); // Remove os fantasmas

          if (houveAlteracao) {
            console.log('Favoritos sincronizados com preços e dados atuais do servidor!');
            return favoritosSincronizados;
          }
          
          return prev;
        });

      } catch (error) {
        console.error("Erro ao sincronizar favoritos com o servidor:", error);
      }
    };

    sincronizarFavoritos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // 3. Guarda sempre que há alterações limpas
  useEffect(() => {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }, [favoritos]);

  const toggleFavorite = (produto) => {
    setFavoritos((prev) => {
      const existe = prev.some((p) => p.id === produto.id);
      if (existe) {
        return prev.filter((p) => p.id !== produto.id);
      } else {
        return [...prev, produto];
      }
    });
  };

  const isFavorite = (id) => {
    return favoritos.some((p) => p.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favoritos, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);