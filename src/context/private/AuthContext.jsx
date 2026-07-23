import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Ajusta o URL se necessário
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // 1. Mudança aqui: Buscar ao sessionStorage ao iniciar
  const [token, setToken] = useState(sessionStorage.getItem('auth_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // 2. Mudança aqui: Guardar no sessionStorage
      sessionStorage.setItem('auth_token', token);
      validarSessao();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      // 3. Mudança aqui: Remover do sessionStorage
      sessionStorage.removeItem('auth_token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const validarSessao = async () => {
    try {
      const response = await axios.get(`${API_URL}/me`);
      setUser(response.data);
    } catch (error) {
      console.error("Sessão inválida ou expirada.");
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      setToken(response.data.access_token);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro de comunicação.'
      };
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await axios.post(`${API_URL}/logout`);
      } catch (error) {
        console.error("Erro ao fazer logout", error);
      }
    }
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {!loading ? (
        children
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};