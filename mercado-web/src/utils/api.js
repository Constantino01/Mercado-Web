const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function apiFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  // Headers padrão que todas as tuas chamadas vão precisar
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Mais tarde, quando tivermos login:
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Tratamento de erros automático
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ${response.status}: Ocorreu um problema no servidor.`);
    }
    
    // Se o pedido for um DELETE com sucesso (204 No Content), não tentamos ler o JSON
    if (response.status === 204) return null;
    
    return await response.json();
    
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error; // Lança o erro para que o formulário o possa mostrar ao utilizador
  }
}

export const apiCRUD = {
    read: async (endpoint) => {
        return await apiFetch(endpoint, {
            method: 'GET',
        });
    },

    create: async (endpoint, data) => {
        return await apiFetch(endpoint, {
                method: 'POST',
                body: JSON.stringify(data),
            });
    },

    update: async (endpoint, data) => {
        return await apiFetch(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete: async (endpoint) => {
        return await apiFetch(endpoint, {
            method: 'DELETE',
        });
    }
};