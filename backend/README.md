# Recipe Blog Backend

This is the backend for the Recipe Blog application built with Django REST Framework.

## Setup

1. Install Python 3.8+ and pip
2. Create a virtual environment
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```
   python manage.py migrate
   ```
5. Create a superuser:
   ```
   python manage.py createsuperuser
   ```
6. Run the development server:
   ```
   python manage.py runserver
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register a new user
- `POST /api/auth/login/` - Login a user
- `GET /api/auth/user/` - Get the current user
- `POST /api/auth/logout/` - Logout a user

### Recipes
- `GET /api/recipes/` - List all recipes
- `POST /api/recipes/` - Create a new recipe
- `GET /api/recipes/{id}/` - Get a recipe by ID
- `PATCH /api/recipes/{id}/` - Update a recipe
- `DELETE /api/recipes/{id}/` - Delete a recipe
- `POST /api/recipes/{id}/rate/` - Rate a recipe
- `GET /api/recipes/search/` - Search recipes

### Categories
- `GET /api/categories/` - List all categories
- `GET /api/categories/{slug}/recipes/` - Get recipes by category

### Comments
- `POST /api/recipes/{id}/comments/` - Add a comment to a recipe

[![Netlify Status](https://api.netlify.com/api/v1/badges/697dec4b-e34d-4503-b72a-342e23febb0c/deploy-status)](https://app.netlify.com/projects/cooking223/deploys)
