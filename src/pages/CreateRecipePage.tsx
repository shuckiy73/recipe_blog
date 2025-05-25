import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RecipeForm from '../components/recipe/RecipeForm';
import { createRecipe } from '../services/api';

const CreateRecipePage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    try {
      const newRecipe = await createRecipe(formData);
      navigate(`/recipe/${newRecipe.id}`);
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-amber-800 mb-4">
            Требуется авторизация
          </h2>
          <p className="text-gray-700 mb-6">
            Чтобы добавить рецепт, необходимо войти в систему или зарегистрироваться.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Войти
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
            >
              Регистрация
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Добавить новый рецепт</h1>
      <p className="text-gray-600 mb-8">
        Поделитесь своим кулинарным шедевром с нашим сообществом
      </p>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <RecipeForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateRecipePage;