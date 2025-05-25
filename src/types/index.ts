export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  recipes_count: number;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
}

export interface Step {
  id: string;
  description: string;
  image_url?: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: User;
  likes_count: number;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  cooking_time: number;
  servings: number;
  image_url: string;
  created_at: string;
  updated_at: string;
  rating: number;
  reviews_count: number;
  user_rating?: number;
  featured: boolean;
  ingredients: Ingredient[];
  steps: Step[];
  category: {
    id: number;
    name: string;
    slug: string;
  };
  author: User;
  comments: Comment[];
  nutrition?: Nutrition;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
  total_pages: number;
}