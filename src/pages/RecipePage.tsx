import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getRecipeById, rateRecipe, addComment } from '../services/api';
import { Clock, Users, Printer, Bookmark, Star, Heart, Share2, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  
  const { data: recipe, isLoading, error, refetch } = useQuery(
    ['recipe', id],
    () => getRecipeById(id as string),
    { enabled: !!id }
  );

  const handleRating = async (rating: number) => {
    if (!user) {
      alert('Пожалуйста, войдите в систему, чтобы оценить рецепт');
      return;
    }
    
    try {
      await rateRecipe(id as string, rating);
      refetch();
    } catch (error) {
      console.error('Error rating recipe:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Пожалуйста, войдите в систему, чтобы оставить комментарий');
      return;
    }
    
    if (!commentText.trim()) return;
    
    try {
      await addComment(id as string, commentText);
      setCommentText('');
      refetch();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 max-w-lg rounded"></div>
          <div className="h-80 bg-gray-200 rounded-lg"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Ошибка загрузки рецепта</h2>
        <p className="text-gray-600">
          Не удалось загрузить данные рецепта. Пожалуйста, попробуйте позже.
        </p>
        <Link to="/" className="mt-4 inline-block text-green-600 hover:underline">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-green-600">Главная</Link>
          <span className="mx-2">/</span>
          <Link to={`/category/${recipe.category.slug}`} className="hover:text-green-600">
            {recipe.category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{recipe.title}</span>
        </div>
        
        {/* Recipe Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{recipe.title}</h1>
        
        {/* Recipe Meta */}
        <div className="flex flex-wrap items-center text-gray-600 mb-6 gap-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-1" />
            <span>{recipe.cooking_time} мин</span>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-1" />
            <span>{recipe.servings} порц.</span>
          </div>
          <div className="flex items-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    recipe.rating >= star ? 'text-amber-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-1">({recipe.reviews_count})</span>
          </div>
          <div>
            <span className="text-gray-500">
              {new Date(recipe.created_at).toLocaleDateString('ru-RU')}
            </span>
          </div>
        </div>
        
        {/* Author */}
        <div className="flex items-center mb-6">
          <img
            src={recipe.author.avatar_url || 'https://via.placeholder.com/40'}
            alt={recipe.author.username}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="font-medium">{recipe.author.username}</p>
            <p className="text-sm text-gray-500">Автор рецепта</p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Bookmark className="h-5 w-5 mr-2 text-green-600" />
            <span>Сохранить</span>
          </button>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Printer className="h-5 w-5 mr-2 text-green-600" />
            <span>Распечатать</span>
          </button>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Share2 className="h-5 w-5 mr-2 text-green-600" />
            <span>Поделиться</span>
          </button>
          {user?.id === recipe.author.id && (
            <Link
              to={`/edit-recipe/${recipe.id}`}
              className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
            >
              <Edit className="h-5 w-5 mr-2" />
              <span>Редактировать</span>
            </Link>
          )}
        </div>
        
        {/* Recipe Image */}
        <div className="mb-8">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
        
        {/* Recipe Description */}
        <div className="mb-8 bg-amber-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Описание</h2>
          <p className="text-gray-700">{recipe.description}</p>
        </div>
        
        {/* Recipe Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Ingredients */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Ингредиенты</h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between pb-2 border-b border-gray-100">
                    <span>{ingredient.name}</span>
                    <span className="text-gray-600">{ingredient.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Инструкции</h2>
              <ol className="space-y-6">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-medium mr-4">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-gray-700">{step.description}</p>
                      {step.image_url && (
                        <img
                          src={step.image_url}
                          alt={`Шаг ${index + 1}`}
                          className="mt-3 max-w-xs rounded-md"
                        />
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
        
        {/* Nutrition Facts */}
        {recipe.nutrition && (
          <div className="mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Пищевая ценность (на порцию)</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-green-50 p-3 rounded-md text-center">
                  <p className="text-sm text-gray-600">Калории</p>
                  <p className="font-bold text-lg">{recipe.nutrition.calories} ккал</p>
                </div>
                <div className="bg-green-50 p-3 rounded-md text-center">
                  <p className="text-sm text-gray-600">Белки</p>
                  <p className="font-bold text-lg">{recipe.nutrition.protein} г</p>
                </div>
                <div className="bg-green-50 p-3 rounded-md text-center">
                  <p className="text-sm text-gray-600">Жиры</p>
                  <p className="font-bold text-lg">{recipe.nutrition.fat} г</p>
                </div>
                <div className="bg-green-50 p-3 rounded-md text-center">
                  <p className="text-sm text-gray-600">Углеводы</p>
                  <p className="font-bold text-lg">{recipe.nutrition.carbs} г</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Rating Section */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Оцените рецепт</h2>
            {user ? (
              <div className="flex items-center">
                <p className="mr-4">Ваша оценка:</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          recipe.user_rating >= star
                            ? 'text-amber-400'
                            : 'text-gray-300 hover:text-amber-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">
                <Link to="/login" className="text-green-600 hover:underline">
                  Войдите
                </Link>
                , чтобы оценить рецепт
              </p>
            )}
          </div>
        </div>
        
        {/* Comments Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Комментарии ({recipe.comments.length})</h2>
          
          {/* Add Comment Form */}
          <div className="mb-8">
            <form onSubmit={handleAddComment}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={user ? 'Добавьте комментарий...' : 'Войдите, чтобы оставить комментарий'}
                disabled={!user}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                rows={4}
              ></textarea>
              {user && (
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="mt-3 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Отправить
                </button>
              )}
            </form>
          </div>
          
          {/* Comments List */}
          <div className="space-y-6">
            {recipe.comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Пока нет комментариев. Будьте первым!</p>
            ) : (
              recipe.comments.map((comment) => (
                <div key={comment.id} className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="flex items-center mb-3">
                    <img
                      src={comment.user.avatar_url || 'https://via.placeholder.com/40'}
                      alt={comment.user.username}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium">{comment.user.username}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                  
                  <div className="mt-3 flex items-center">
                    <button className="flex items-center text-gray-500 hover:text-red-500">
                      <Heart className="h-4 w-4 mr-1" />
                      <span>{comment.likes_count}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;