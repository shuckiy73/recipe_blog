import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star } from 'lucide-react';
import { Recipe } from '../../types';

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, className = '' }) => {
  return (
    <Link 
      to={`/recipe/${recipe.id}`}
      className={`block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={recipe.image_url} 
          alt={recipe.title} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
        {recipe.featured && (
          <div className="absolute top-0 right-0 bg-amber-500 text-white px-2 py-1 text-xs font-medium">
            Рекомендуем
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{recipe.title}</h3>
        
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <div className="flex items-center mr-4">
            <Clock className="h-4 w-4 mr-1" />
            <span>{recipe.cooking_time} мин</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{recipe.servings} порц.</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className={`h-4 w-4 ${recipe.rating >= 1 ? 'text-amber-400' : 'text-gray-300'}`} />
            <Star className={`h-4 w-4 ${recipe.rating >= 2 ? 'text-amber-400' : 'text-gray-300'}`} />
            <Star className={`h-4 w-4 ${recipe.rating >= 3 ? 'text-amber-400' : 'text-gray-300'}`} />
            <Star className={`h-4 w-4 ${recipe.rating >= 4 ? 'text-amber-400' : 'text-gray-300'}`} />
            <Star className={`h-4 w-4 ${recipe.rating >= 5 ? 'text-amber-400' : 'text-gray-300'}`} />
            <span className="ml-1 text-sm text-gray-600">({recipe.reviews_count})</span>
          </div>
          
          <span className="text-sm text-gray-500">
            {new Date(recipe.created_at).toLocaleDateString('ru-RU')}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;