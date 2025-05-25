import React from 'react';
import RecipeCard from './RecipeCard';
import { Recipe } from '../../types';

interface RecipeListProps {
  recipes: Recipe[];
  title?: string;
  loading?: boolean;
  error?: string | null;
}

const RecipeList: React.FC<RecipeListProps> = ({ 
  recipes, 
  title, 
  loading = false,
  error = null 
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {title && <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="flex space-x-4">
                  <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        <p>Ошибка: {typeof error === 'object' ? error.message || 'Неизвестная ошибка' : error}</p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="bg-amber-50 p-6 rounded-md text-center">
        <p className="text-amber-700">Нет рецептов для отображения.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title && <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default RecipeList;