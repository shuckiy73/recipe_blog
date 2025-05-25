from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    
    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    @property
    def recipes_count(self):
        return self.recipes.count()

class Recipe(models.Model):
    title = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')
    ingredients = models.JSONField(verbose_name='Ингредиенты')
    steps = models.JSONField(verbose_name='Шаги приготовления')
    cooking_time = models.PositiveIntegerField(verbose_name='Время приготовления (мин)')
    servings = models.PositiveIntegerField(default=1, verbose_name='Количество порций')
    image = models.ImageField(upload_to='recipes/', verbose_name='Изображение')
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='recipes', 
        verbose_name='Категория'
    )
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='recipes',
        verbose_name='Автор'
    )
    featured = models.BooleanField(default=False, verbose_name='Рекомендуемый')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    
    class Meta:
        verbose_name = 'Рецепт'
        verbose_name_plural = 'Рецепты'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    @property
    def rating(self):
        ratings = self.ratings.all()
        if not ratings:
            return 0
        return sum(r.value for r in ratings) / ratings.count()
    
    @property
    def reviews_count(self):
        return self.ratings.count()

class Rating(models.Model):
    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE, related_name='ratings',
        verbose_name='Рецепт'
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='ratings',
        verbose_name='Пользователь'
    )
    value = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name='Оценка'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Оценка'
        verbose_name_plural = 'Оценки'
        unique_together = ['recipe', 'user']
    
    def __str__(self):
        return f"{self.user.username} - {self.recipe.title} - {self.value}"

class Comment(models.Model):
    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE, related_name='comments',
        verbose_name='Рецепт'
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='comments',
        verbose_name='Пользователь'
    )
    content = models.TextField(verbose_name='Содержание')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.recipe.title}"
    
    @property
    def likes_count(self):
        return self.likes.count()

class CommentLike(models.Model):
    comment = models.ForeignKey(
        Comment, on_delete=models.CASCADE, related_name='likes',
        verbose_name='Комментарий'
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='comment_likes',
        verbose_name='Пользователь'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Лайк комментария'
        verbose_name_plural = 'Лайки комментариев'
        unique_together = ['comment', 'user']
    
    def __str__(self):
        return f"{self.user.username} - {self.comment.id}"