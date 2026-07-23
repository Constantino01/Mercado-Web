import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function apiFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  try {
    // Configuramos o Axios com base nas opções que passaste
    const response = await axios({
      url: url,
      method: options.method || 'GET',
      data: options.body, // O Axios usa 'data' em vez de 'body' do fetch
      headers: {
        'Accept': 'application/json',
        ...options.headers,
      }
    });
    
    // O Axios converte o JSON automaticamente e devolve em "response.data"
    // Se for um 204 (No Content), devolve vazio sem rebentar.
    return response.data;
    
  } catch (error) {
    // Se o Laravel devolver um erro (ex: 401 Unauthenticated, 422 Validação, etc.)
    if (error.response) {
      throw new Error(
        error.response.data?.message || `Erro ${error.response.status}: Ocorreu um problema no servidor.`
      );
    }
    
    // Se o servidor estiver desligado ou houver falha de rede
    console.error(`[API Error] ${endpoint}:`, error);
    throw new Error('Erro de ligação ao servidor.');
  }
}

export const apiCRUD = {
    read: async (endpoint) => {
        return await apiFetch(endpoint, { method: 'GET' });
    },

    create: async (endpoint, data) => {
        return await apiFetch(endpoint, {
            method: 'POST',
            // O Axios deteta sozinho se é FormData (Ficheiro) ou Objeto (JSON)
            // Já não precisamos do isFormData nem do JSON.stringify() !
            body: data, 
        });
    },

    update: async (endpoint, data) => {
        return await apiFetch(endpoint, {
            method: 'PUT',
            body: data,
        });
    },

    delete: async (endpoint) => {
        return await apiFetch(endpoint, { method: 'DELETE' });
    }
};