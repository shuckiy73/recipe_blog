import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, ChefHat } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-green-600 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-amber-300" />
            <span className="text-xl font-bold text-white">CookBook</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-4">
              <Link to="/" className="text-white hover:text-amber-200 transition-colors">
                Главная
              </Link>
              <Link to="/category/breakfast" className="text-white hover:text-amber-200 transition-colors">
                Завтраки
              </Link>
              <Link to="/category/lunch" className="text-white hover:text-amber-200 transition-colors">
                Обеды
              </Link>
              <Link to="/category/dinner" className="text-white hover:text-amber-200 transition-colors">
                Ужины
              </Link>
              <Link to="/category/dessert" className="text-white hover:text-amber-200 transition-colors">
                Десерты
              </Link>
            </nav>

            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Поиск рецептов..."
                className="pl-3 pr-10 py-1 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 w-48"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Search className="h-4 w-4 text-gray-500" />
              </button>
            </form>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/create-recipe" className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition-colors">
                  Добавить рецепт
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-white">
                    <User className="h-5 w-5" />
                    <span>{user?.username}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-amber-100">
                      Профиль
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-amber-100"
                    >
                      Выйти
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-amber-200 transition-colors">
                  Войти
                </Link>
                <Link to="/register" className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition-colors">
                  Регистрация
                </Link>
              </>
            )}
          </div>

          <button onClick={toggleMenu} className="md:hidden text-white">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-green-700">
            <form onSubmit={handleSearch} className="mb-4 relative">
              <input
                type="text"
                placeholder="Поиск рецептов..."
                className="w-full pl-3 pr-10 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search className="h-5 w-5 text-gray-500" />
              </button>
            </form>

            <nav className="flex flex-col space-y-3 mb-4">
              <Link to="/" className="text-white hover:text-amber-200 transition-colors">
                Главная
              </Link>
              <Link to="/category/breakfast" className="text-white hover:text-amber-200 transition-colors">
                Завтраки
              </Link>
              <Link to="/category/lunch" className="text-white hover:text-amber-200 transition-colors">
                Обеды
              </Link>
              <Link to="/category/dinner" className="text-white hover:text-amber-200 transition-colors">
                Ужины
              </Link>
              <Link to="/category/dessert" className="text-white hover:text-amber-200 transition-colors">
                Десерты
              </Link>
            </nav>

            <div className="flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/create-recipe"
                    className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition-colors text-center"
                  >
                    Добавить рецепт
                  </Link>
                  <Link
                    to="/profile"
                    className="text-white hover:text-amber-200 transition-colors"
                  >
                    Профиль
                  </Link>
                  <button
                    onClick={logout}
                    className="text-white hover:text-amber-200 transition-colors text-left"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white hover:text-amber-200 transition-colors"
                  >
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition-colors text-center"
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;