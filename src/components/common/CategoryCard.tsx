import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  slug: string;
  imageUrl: string;
  count: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, slug, imageUrl, count }) => {
  return (
    <Link 
      to={`/category/${slug}`}
      className="group relative overflow-hidden rounded-lg shadow-md"
    >
      <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-50 transition-opacity z-10"></div>
      
      <img 
        src={imageUrl} 
        alt={title}
        className="w-full h-44 object-cover transform group-hover:scale-105 transition-transform duration-300" 
      />
      
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-4">
        <h3 className="text-white text-xl font-bold mb-1">{title}</h3>
        <p className="text-white text-sm mb-2">{count} рецептов</p>
        
        <div className="flex items-center text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Посмотреть</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;