from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Avg, Count, Q
from django.shortcuts import get_object_or_404
from .models import Category, Recipe, Rating, Comment
from .serializers import (
    CategorySerializer, RecipeSerializer, RatingSerializer,
    CommentSerializer, CommentCreateSerializer
)
from .permissions import IsAuthorOrReadOnly

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    
    @action(detail=True, methods=['get'])
    def recipes(self, request, slug=None):
        category = self.get_object()
        recipes = Recipe.objects.filter(category=category)
        
        # Apply filtering and sorting
        recipes = self.filter_recipes(recipes, request)
        
        page = self.paginate_queryset(recipes)
        if page is not None:
            serializer = RecipeSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = RecipeSerializer(recipes, many=True, context={'request': request})
        return Response(serializer.data)
    
    def filter_recipes(self, queryset, request):
        # Sorting
        sort = request.query_params.get('sort', 'created_at')
        order = request.query_params.get('order', 'desc')
        
        if sort == 'rating':
            queryset = queryset.annotate(avg_rating=Avg('ratings__value'))
            sort_field = 'avg_rating'
        elif sort == 'title':
            sort_field = 'title'
        elif sort == 'cooking_time':
            sort_field = 'cooking_time'
        else:  # Default to created_at
            sort_field = 'created_at'
        
        if order == 'asc':
            return queryset.order_by(sort_field)
        else:
            return queryset.order_by(f'-{sort_field}')

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description']
    
    def get_queryset(self):
        queryset = Recipe.objects.annotate(
            avg_rating=Avg('ratings__value'),
            reviews_count=Count('ratings', distinct=True)
        )
        
        # Filter by featured
        featured = self.request.query_params.get('featured')
        if featured == 'true':
            queryset = queryset.filter(featured=True)
        
        # Apply sorting
        queryset = self.apply_sorting(queryset)
        
        return queryset
    
    def apply_sorting(self, queryset):
        sort = self.request.query_params.get('sort', 'created_at')
        order = self.request.query_params.get('order', 'desc')
        
        if sort == 'rating':
            sort_field = 'avg_rating'
        elif sort == 'title':
            sort_field = 'title'
        elif sort == 'cooking_time':
            sort_field = 'cooking_time'
        else:  # Default to created_at
            sort_field = 'created_at'
        
        if order == 'asc':
            return queryset.order_by(sort_field)
        else:
            return queryset.order_by(f'-{sort_field}')
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('query', '')
        if not query:
            return Response(
                {"error": "Query parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        recipes = Recipe.objects.filter(
            Q(title__icontains=query) | 
            Q(description__icontains=query)
        ).annotate(
            avg_rating=Avg('ratings__value'),
            reviews_count=Count('ratings', distinct=True)
        )
        
        # Apply sorting based on relevance, rating, etc.
        sort = request.query_params.get('sort', 'relevance')
        if sort == 'relevance':
            # For relevance, prioritize title matches over description matches
            recipes = sorted(
                recipes,
                key=lambda x: (
                    query.lower() in x.title.lower(),
                    x.title.lower().count(query.lower()),
                    x.description.lower().count(query.lower())
                ),
                reverse=True
            )
        else:
            recipes = self.apply_sorting(recipes)
        
        page = self.paginate_queryset(recipes)
        if page is not None:
            serializer = RecipeSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = RecipeSerializer(recipes, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def rate(self, request, pk=None):
        recipe = self.get_object()
        serializer = RatingSerializer(
            data=request.data,
            context={'request': request, 'recipe_id': recipe.id}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'rating set'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def comments(self, request, pk=None):
        recipe = self.get_object()
        serializer = CommentCreateSerializer(
            data=request.data,
            context={'request': request, 'recipe_id': recipe.id}
        )
        
        if serializer.is_valid():
            comment = serializer.save()
            return Response(
                CommentSerializer(comment, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)