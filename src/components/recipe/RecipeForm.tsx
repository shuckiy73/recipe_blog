import React, { useState } from 'react';
import { X, Plus, Upload } from 'lucide-react';

interface Ingredient {
  id: string;
  name: string;
  amount: string;
}

interface Step {
  id: string;
  description: string;
}

interface RecipeFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialValues?: {
    title: string;
    description: string;
    cooking_time: number;
    servings: number;
    category: string;
    ingredients: Ingredient[];
    steps: Step[];
    image?: string;
  };
  isEditing?: boolean;
}

const RecipeForm: React.FC<RecipeFormProps> = ({
  onSubmit,
  initialValues = {
    title: '',
    description: '',
    cooking_time: 30,
    servings: 2,
    category: '',
    ingredients: [{ id: '1', name: '', amount: '' }],
    steps: [{ id: '1', description: '' }],
  },
  isEditing = false,
}) => {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [cookingTime, setCookingTime] = useState(initialValues.cooking_time);
  const [servings, setServings] = useState(initialValues.servings);
  const [category, setCategory] = useState(initialValues.category);
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialValues.ingredients);
  const [steps, setSteps] = useState<Step[]>(initialValues.steps);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialValues.image || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleIngredientChange = (id: string, field: 'name' | 'amount', value: string) => {
    setIngredients(
      ingredients.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
      )
    );
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { id: Date.now().toString(), name: '', amount: '' }]);
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
    }
  };

  const handleStepChange = (id: string, value: string) => {
    setSteps(
      steps.map((step) => (step.id === id ? { ...step, description: value } : step))
    );
  };

  const addStep = () => {
    setSteps([...steps, { id: Date.now().toString(), description: '' }]);
  };

  const removeStep = (id: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter((step) => step.id !== id));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Название обязательно';
    if (!description.trim()) newErrors.description = 'Описание обязательно';
    if (cookingTime <= 0) newErrors.cooking_time = 'Время должно быть больше 0';
    if (servings <= 0) newErrors.servings = 'Количество порций должно быть больше 0';
    if (!category) newErrors.category = 'Выберите категорию';
    
    if (!isEditing && !image) newErrors.image = 'Добавьте фото блюда';
    
    const emptyIngredient = ingredients.find(i => !i.name.trim() || !i.amount.trim());
    if (emptyIngredient) newErrors.ingredients = 'Заполните все поля ингредиентов';
    
    const emptyStep = steps.find(s => !s.description.trim());
    if (emptyStep) newErrors.steps = 'Заполните все шаги приготовления';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('cooking_time', cookingTime.toString());
      formData.append('servings', servings.toString());
      formData.append('category', category);
      formData.append('ingredients', JSON.stringify(ingredients));
      formData.append('steps', JSON.stringify(steps));
      
      if (image) {
        formData.append('image', image);
      }
      
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Произошла ошибка при сохранении рецепта' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'breakfast', label: 'Завтраки' },
    { value: 'lunch', label: 'Обеды' },
    { value: 'dinner', label: 'Ужины' },
    { value: 'dessert', label: 'Десерты' },
    { value: 'drinks', label: 'Напитки' },
    { value: 'salad', label: 'Салаты' },
    { value: 'soup', label: 'Супы' },
    { value: 'snack', label: 'Закуски' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="bg-red-50 p-4 rounded-md text-red-600">
          {errors.submit}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Название рецепта *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Описание *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="cookingTime" className="block text-sm font-medium text-gray-700 mb-1">
              Время приготовления (мин) *
            </label>
            <input
              type="number"
              id="cookingTime"
              value={cookingTime}
              onChange={(e) => setCookingTime(parseInt(e.target.value))}
              min="1"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.cooking_time ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.cooking_time && <p className="mt-1 text-sm text-red-600">{errors.cooking_time}</p>}
          </div>
          
          <div>
            <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-1">
              Количество порций *
            </label>
            <input
              type="number"
              id="servings"
              value={servings}
              onChange={(e) => setServings(parseInt(e.target.value))}
              min="1"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.servings ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.servings && <p className="mt-1 text-sm text-red-600">{errors.servings}</p>}
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Категория *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Выберите категорию</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Фото блюда {!isEditing && '*'}
          </label>
          <div className="flex items-start space-x-4">
            <div
              className={`border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${
                errors.image ? 'border-red-500' : 'border-gray-300'
              }`}
              style={{ minHeight: '150px', minWidth: '150px' }}
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Нажмите, чтобы загрузить</p>
                </>
              )}
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">
                Загрузите фотографию готового блюда. Хорошее качество фото привлекает больше внимания к рецепту.
              </p>
              {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Ингредиенты *
            </label>
            <button
              type="button"
              onClick={addIngredient}
              className="flex items-center text-sm text-green-600 hover:text-green-800"
            >
              <Plus className="h-4 w-4 mr-1" />
              Добавить
            </button>
          </div>
          {errors.ingredients && <p className="mb-2 text-sm text-red-600">{errors.ingredients}</p>}
          <div className="space-y-2">
            {ingredients.map((ingredient) => (
              <div key={ingredient.id} className="flex space-x-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(ingredient.id, 'name', e.target.value)}
                    placeholder="Ингредиент"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="w-1/3">
                  <input
                    type="text"
                    value={ingredient.amount}
                    onChange={(e) =>
                      handleIngredientChange(ingredient.id, 'amount', e.target.value)
                    }
                    placeholder="Количество"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeIngredient(ingredient.id)}
                  className="p-2 text-gray-400 hover:text-red-500"
                  disabled={ingredients.length === 1}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Шаги приготовления *
            </label>
            <button
              type="button"
              onClick={addStep}
              className="flex items-center text-sm text-green-600 hover:text-green-800"
            >
              <Plus className="h-4 w-4 mr-1" />
              Добавить
            </button>
          </div>
          {errors.steps && <p className="mb-2 text-sm text-red-600">{errors.steps}</p>}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex space-x-2">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <textarea
                    value={step.description}
                    onChange={(e) => handleStepChange(step.id, e.target.value)}
                    placeholder={`Шаг ${index + 1}`}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeStep(step.id)}
                  className="p-2 text-gray-400 hover:text-red-500"
                  disabled={steps.length === 1}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Сохранение...' : isEditing ? 'Сохранить изменения' : 'Опубликовать рецепт'}
        </button>
      </div>
    </form>
  );
};

export default RecipeForm;