import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { searchRecipes } from '../services/api';
import RecipeList from '../components/recipe/RecipeList';
import Pagination from '../components/common/Pagination';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const sort = searchParams.get('sort') || 'relevance';
  const order = searchParams.get('order') || 'desc';
  
  const [searchInput, setSearchInput] = useState(query);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  useEffect(() => {
    setSearchInput(query);
  }, [query]);
  
  const { data, isLoading, error } = useQuery(
    ['searchRecipes', query, page, sort, order],
    () => searchRecipes(query, { page, sort, order }),
    { enabled: !!query }
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchParams.set('q', searchInput);
      searchParams.set('page', '1');
      setSearchParams(searchParams);
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
    { value: 'relevance', label: 'Релевантность' },
    { value: 'created_at', label: 'Дата публикации' },
    { value: 'rating', label: 'Рейтинг' },
    { value: 'cooking_time', label: 'Время приготовления' },
  ];

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Поиск рецептов</h1>
        
        <form onSubmit={handleSearch} className="max-w-2xl mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Поиск по названию, ингредиентам..."
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-green-600"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>
        
        {query && (
          <>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center text-gray-700 hover:text-green-600"
              >
                <Filter className="h-5 w-5 mr-1" />
                <span>Фильтры и сортировка</span>
              </button>
              
              <div className="text-sm text-gray-600">
                {data?.count
                  ? `Найдено ${data.count} рецептов по запросу "${query}"`
                  : 'Поиск...'}
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
          </>
        )}
        
        {query && !isLoading && data?.results.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              По запросу "{query}" ничего не найдено
            </h2>
            <p className="text-gray-600 mb-6">
              Попробуйте изменить запрос или поискать по другим ключевым словам
            </p>
          </div>
        )}
        
        {!query && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Введите запрос для поиска рецептов
            </h2>
            <p className="text-gray-600">
              Вы можете искать по названию блюда, ингредиентам или типу кухни
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;