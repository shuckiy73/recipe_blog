import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getRecipesByCategory } from '../services/api';
import RecipeList from '../components/recipe/RecipeList';
import Pagination from '../components/common/Pagination';
import { Filter, ArrowUpDown } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = parseInt(searchParams.get('page') || '1');
  const sort = searchParams.get('sort') || 'created_at';
  const order = searchParams.get('order') || 'desc';
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { data, isLoading, error } = useQuery(
    ['recipesByCategory', category, page, sort, order],
    () => getRecipesByCategory(category as string, { page, sort, order })
  );
  
  const getCategoryTitle = () => {
    switch (category) {
      case 'breakfast':
        return 'Завтраки';
      case 'lunch':
        return 'Обеды';
      case 'dinner':
        return 'Ужины';
      case 'dessert':
        return 'Десерты';
      case 'drinks':
        return 'Напитки';
      case 'popular':
        return 'Популярные рецепты';
      case 'latest':
        return 'Новые рецепты';
      case 'featured':
        return 'Рекомендуемые рецепты';
      default:
        return category;
    }
  };
  
  const handlePageChange = (newPage: number) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
    window.scrollTo(0, 0);
  };
  
  const handleSortChange = (newSort: string) => {
    searchParams.set('sort', newSort);
    
    if (sort === newSort) {
      // Toggle order if same sort field is selected
      searchParams.set('order', order === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to desc for new sort field
      searchParams.set('order', 'desc');
    }
    
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };
  
  const sortOptions = [
    { value: 'created_at', label: 'Дата публикации' },
    { value: 'rating', label: 'Рейтинг' },
    { value: 'cooking_time', label: 'Время приготовления' },
    { value: 'title', label: 'Название' },
  ];

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{getCategoryTitle()}</h1>
      
      {/* Filters */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center text-gray-700 hover:text-green-600"
          >
            <Filter className="h-5 w-5 mr-1" />
            <span>Фильтры и сортировка</span>
          </button>
          
          <div className="text-sm text-gray-600">
            {data?.count ? `${data.count} рецептов` : ''}
          </div>
        </div>
        
        {isFilterOpen && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div>
              <h3 className="font-medium mb-2">Сортировка</h3>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm ${
                      sort === option.value
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                    {sort === option.value && (
                      <ArrowUpDown className={`h-4 w-4 ml-1 ${order === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <RecipeList
        recipes={data?.results || []}
        loading={isLoading}
        error={error as string}
      />
      
      {data && data.total_pages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.total_pages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default CategoryPage;