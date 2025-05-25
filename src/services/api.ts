import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network or server error
      throw new Error('Не удалось подключиться к серверу. Пожалуйста, проверьте подключение к интернету и повторите попытку позже.');
    }
    
    // Extract detailed error message from response if available
    const errorMessage = error.response.data?.detail || 
                        error.response.data?.message ||
                        Object.values(error.response.data || {})[0];
                        
    if (error.response.status === 404) {
      throw new Error('Запрашиваемый ресурс не найден.');
    }
    if (error.response.status === 401) {
      throw new Error('Вы не авторизованы для выполнения этого действия.');
    }
    if (error.response.status === 403) {
      throw new Error('У вас нет прав для выполнения этого действия.');
    }
    if (error.response.status >= 500) {
      throw new Error('Произошла внутренняя ошибка сервера. Пожалуйста, повторите попытку позже.');
    }
    
    // Throw the detailed error message if available, otherwise throw the response data or original error
    throw new Error(errorMessage || error.message);
  }
);

export default api;

export const getRecipes = async (params = {}) => {
  try {
    const response = await api.get('/recipes/', { params });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Произошла ошибка при загрузке рецептов.');
  }
};

export const getRecipeById = async (id: string) => {
  try {
    const response = await api.get(`/recipes/${id}/`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Произошла ошибка при загрузке рецепта.');
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/categories/');
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Произошла ошибка при загрузке категорий.');
  }
};

export const getRecipesByCategory = async (category: string, params = {}) => {
  try {
    const response = await api.get(`/categories/${category}/recipes/`, { params });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Произошла ошибка при загрузке рецептов для этой категории.');
  }
};

export const searchRecipes = async (query: string) => {
  try {
    const response = await api.get('/recipes/search/', { params: { query } });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Произошла ошибка при поиске рецептов.');
  }
};

export const createRecipe = async (recipeData: FormData) => {
  try {
    const response = await api.post('/recipes/', recipeData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Произошла ошибка при создании рецепта.');
  }
};

export const updateRecipe = async (id: string, recipeData: FormData) => {
  try {
    const response = await api.patch(`/recipes/${id}/`, recipeData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Произошла ошибка при обновлении рецепта.');
  }
};

export const deleteRecipe = async (id: string) => {
  try {
    await api.delete(`/recipes/${id}/`);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Произошла ошибка при удалении рецепта.');
  }
};

export const rateRecipe = async (id: string, rating: number) => {
  try {
    const response = await api.post(`/recipes/${id}/rate/`, { rating });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Произошла ошибка при оценке рецепта.');
  }
};

export const addComment = async (id: string, content: string) => {
  try {
    const response = await api.post(`/recipes/${id}/comments/`, { content });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Произошла ошибка при добавлении комментария.');
  }
};