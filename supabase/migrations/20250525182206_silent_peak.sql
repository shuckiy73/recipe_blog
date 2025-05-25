/*
  # Insert test data

  This migration adds sample data for testing:
  - Categories
  - Recipes
  - Comments
  - Ratings
*/

-- Insert test categories
INSERT INTO categories (name, slug, description, image_url) VALUES
('Завтраки', 'breakfast', 'Вкусные и питательные завтраки на каждый день', 'https://images.pexels.com/photos/2662875/pexels-photo-2662875.jpeg'),
('Обеды', 'lunch', 'Сытные обеды для всей семьи', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'),
('Ужины', 'dinner', 'Легкие и вкусные ужины', 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg'),
('Десерты', 'dessert', 'Сладкие десерты и выпечка', 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'),
('Напитки', 'drinks', 'Освежающие напитки и коктейли', 'https://images.pexels.com/photos/544961/pexels-photo-544961.jpeg');

-- Insert test recipes (you'll need to replace user_id with actual IDs after users register)
INSERT INTO recipes (
  title, description, ingredients, steps, cooking_time, servings,
  image_url, category_id, user_id, featured
) 
SELECT
  'Омлет с сыром',
  'Классический французский омлет с сыром',
  '[{"name": "Яйца", "amount": "3 шт"}, {"name": "Молоко", "amount": "50 мл"}, {"name": "Сыр", "amount": "50 г"}]'::jsonb,
  '[{"description": "Взбить яйца с молоком"}, {"description": "Вылить на сковороду"}, {"description": "Посыпать тертым сыром"}]'::jsonb,
  15,
  1,
  'https://images.pexels.com/photos/461378/pexels-photo-461378.jpeg',
  (SELECT id FROM categories WHERE slug = 'breakfast'),
  auth.uid(),
  true
WHERE EXISTS (
  SELECT 1 FROM auth.users LIMIT 1
);