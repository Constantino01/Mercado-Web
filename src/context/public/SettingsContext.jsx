import { createContext, useContext, useState, useEffect } from 'react';
import { apiCRUD } from '../../utils/api'; 

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [allowPurchases, setAllowPurchases] = useState(true); 
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = async () => {
    try {
      const data = await apiCRUD.read('/settings');
      // Assume "1" (ativo) se a configuração ainda não existir na base de dados
      const isAllowed = data.allow_purchases ? data.allow_purchases === '1' : true;
      setAllowPurchases(isAllowed);
    } catch (error) {
      console.error("Erro ao carregar definições da loja", error);
    } finally {
      setLoadingSettings(false);
    }
  };

  const togglePurchases = async () => {
    const newValue = !allowPurchases;
    setAllowPurchases(newValue); // Atualização instantânea na interface
    
    try {
      await apiCRUD.create('/settings', { 
        key: 'allow_purchases', 
        value: newValue ? '1' : '0' 
      });
    } catch (error) {
      alert("Erro ao alterar definições de compra.");
      setAllowPurchases(!newValue); // Reverte se a API falhar
    }
  };

  return (
    <SettingsContext.Provider value={{ allowPurchases, togglePurchases, loadingSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);