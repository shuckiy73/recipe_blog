import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getRecipes, getCategories } from '../services/api';
import RecipeList from '../components/recipe/RecipeList';
import CategoryCard from '../components/common/CategoryCard';
import { ChefHat, Bookmark, Award, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const { data: featuredRecipes, isLoading: loadingFeatured, error: featuredError } = useQuery(
    'featuredRecipes',
    () => getRecipes({ featured: true, limit: 3 })
  );
  
  const { data: latestRecipes, isLoading: loadingLatest, error: latestError } = useQuery(
    'latestRecipes',
    () => getRecipes({ limit: 6, sort: 'created_at' })
  );
  
  const { data: popularRecipes, isLoading: loadingPopular, error: popularError } = useQuery(
    'popularRecipes',
    () => getRecipes({ limit: 6, sort: 'rating' })
  );
  
  const { data: categories, isLoading: loadingCategories } = useQuery(
    'categories',
    getCategories
  );

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-green-700 rounded-xl overflow-hidden">
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Кулинарные шедевры на вашей кухне
              </h1>
              <p className="text-green-100 text-lg md:text-xl max-w-lg">
                Откройте для себя тысячи рецептов, созданных профессиональными поварами и кулинарными энтузиастами со всего мира.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/category/popular"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md transition-colors"
                >
                  Популярные рецепты
                </Link>
                <Link
                  to="/create-recipe"
                  className="px-6 py-3 bg-white hover:bg-gray-100 text-green-700 font-medium rounded-md transition-colors"
                >
                  Добавить рецепт
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <img
                src="https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg"
                alt="Delicious food"
                className="rounded-lg shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center space-x-2">
                  <Award className="h-6 w-6 text-amber-500" />
                  <span className="font-medium">Более 1000 рецептов</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <ChefHat className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Простые рецепты</h3>
              <p className="text-gray-600">
                Подробные инструкции с пошаговыми фотографиями помогут приготовить любое блюдо.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Bookmark className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Личная коллекция</h3>
              <p className="text-gray-600">
                Сохраняйте любимые рецепты в личной коллекции и всегда имейте к ним доступ.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Проверенное качество</h3>
              <p className="text-gray-600">
                Все рецепты проходят тщательную проверку и тестирование перед публикацией.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Рекомендуемые рецепты</h2>
            <Link
              to="/category/featured"
              className="flex items-center text-green-600 hover:text-green-800 transition-colors"
            >
              <span>Все рекомендуемые</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <RecipeList
            recipes={featuredRecipes?.results || []}
            loading={loadingFeatured}
            error={featuredError as string}
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-6 bg-green-50 rounded-xl">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Категории рецептов</h2>
          {loadingCategories ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-44 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories?.slice(0, 8).map((category) => (
                <CategoryCard
                  key={category.id}
                  title={category.name}
                  slug={category.slug}
                  imageUrl={category.image_url}
                  count={category.recipes_count}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Recipes Section */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Новые рецепты</h2>
            <Link
              to="/category/latest"
              className="flex items-center text-green-600 hover:text-green-800 transition-colors"
            >
              <span>Все новые рецепты</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <RecipeList
            recipes={latestRecipes?.results || []}
            loading={loadingLatest}
            error={latestError as string}
          />
        </div>
      </section>

      {/* Popular Recipes Section */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Популярные рецепты</h2>
            <Link
              to="/category/popular"
              className="flex items-center text-green-600 hover:text-green-800 transition-colors"
            >
              <span>Все популярные рецепты</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <RecipeList
            recipes={popularRecipes?.results || []}
            loading={loadingPopular}
            error={popularError as string}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-amber-50 rounded-xl py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Поделитесь своими кулинарными идеями</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            У вас есть уникальный рецепт, которым вы хотите поделиться? Станьте частью нашего сообщества и опубликуйте свой рецепт прямо сейчас!
          </p>
          <Link
            to="/create-recipe"
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors inline-block"
          >
            Добавить рецепт
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;