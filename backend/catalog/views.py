from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet для управления категориями.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'key'


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet для управления товарами.
    """
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        """Добавляем request в контекст для построения абсолютных URL"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Получить товары по категории"""
        category_key = request.query_params.get('category')
        if category_key:
            try:
                category = Category.objects.get(key=category_key)
                products = self.queryset.filter(category=category)
                serializer = self.get_serializer(products, many=True)
                return Response(serializer.data)
            except Category.DoesNotExist:
                return Response({'error': 'Category not found'}, status=404)
        return Response({'error': 'category parameter required'}, status=400)
