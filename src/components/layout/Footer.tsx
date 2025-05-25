import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-700 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <ChefHat className="h-8 w-8 text-amber-300" />
              <span className="text-xl font-bold">CookBook</span>
            </Link>
            <p className="text-green-100">
              Лучшие рецепты со всего мира, доступные каждому. Готовьте с удовольствием!
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-green-600 pb-2">Категории</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/breakfast" className="text-green-100 hover:text-amber-200 transition-colors">
                  Завтраки
                </Link>
              </li>
              <li>
                <Link to="/category/lunch" className="text-green-100 hover:text-amber-200 transition-colors">
                  Обеды
                </Link>
              </li>
              <li>
                <Link to="/category/dinner" className="text-green-100 hover:text-amber-200 transition-colors">
                  Ужины
                </Link>
              </li>
              <li>
                <Link to="/category/dessert" className="text-green-100 hover:text-amber-200 transition-colors">
                  Десерты
                </Link>
              </li>
              <li>
                <Link to="/category/drinks" className="text-green-100 hover:text-amber-200 transition-colors">
                  Напитки
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-green-600 pb-2">Информация</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-green-100 hover:text-amber-200 transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-green-100 hover:text-amber-200 transition-colors">
                  Контакты
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-green-100 hover:text-amber-200 transition-colors">
                  Условия использования
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-green-100 hover:text-amber-200 transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-green-600 pb-2">Свяжитесь с нами</h3>
            <p className="text-green-100 mb-4">
              Подписывайтесь на наши социальные сети, чтобы быть в курсе новых рецептов
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-amber-300 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-white hover:text-amber-300 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-white hover:text-amber-300 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-green-600 mt-8 pt-4 text-center text-green-100">
          <p>&copy; {new Date().getFullYear()} CookBook. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;