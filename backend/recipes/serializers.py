from rest_framework import serializers
from .models import Category, Recipe, Rating, Comment
from users.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    recipes_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'recipes_count']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            representation['image_url'] = instance.image.url
        else:
            representation['image_url'] = None
        return representation

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    likes_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_at', 'user', 'likes_count']

class RecipeSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        write_only=True,
        source='category'
    )
    rating = serializers.FloatField(read_only=True)
    reviews_count = serializers.IntegerField(read_only=True)
    user_rating = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Recipe
        fields = [
            'id', 'title', 'description', 'ingredients', 'steps', 'cooking_time',
            'servings', 'image', 'category', 'category_id', 'author', 'featured',
            'created_at', 'updated_at', 'rating', 'reviews_count', 'user_rating',
            'comments'
        ]
        read_only_fields = ['author', 'featured', 'created_at', 'updated_at']
    
    def get_user_rating(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                rating = Rating.objects.get(recipe=obj, user=request.user)
                return rating.value
            except Rating.DoesNotExist:
                pass
        return None
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            representation['image_url'] = instance.image.url
        return representation
    
    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['author'] = request.user
        return super().create(validated_data)

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['value']
    
    def create(self, validated_data):
        recipe_id = self.context['recipe_id']
        user = self.context['request'].user
        
        # Update existing rating or create new one
        rating, created = Rating.objects.update_or_create(
            recipe_id=recipe_id,
            user=user,
            defaults={'value': validated_data['value']}
        )
        
        return rating

class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['content']
    
    def create(self, validated_data):
        recipe_id = self.context['recipe_id']
        user = self.context['request'].user
        
        comment = Comment.objects.create(
            recipe_id=recipe_id,
            user=user,
            **validated_data
        )
        
        return comment