from django.conf import settings
from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'key', 'label', 'order']


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        required=False
    )

    class Meta:
        model = Product
        fields = [
            'id',
            'category',
            'category_id',
            'name',
            'description',
            'price',
            'unit',
            'order',
            'image'
        ]
        read_only_fields = ['id']

    def to_representation(self, instance):
        """Преобразуем image в URL, доступный из браузера (публичный хост)."""
        representation = super().to_representation(instance)
        if instance.image:
            url = instance.image.url.lstrip('/')
            if getattr(settings, 'PUBLIC_BASE_URL', None):
                representation['image'] = f"{settings.PUBLIC_BASE_URL}/{url}"
            else:
                request = self.context.get('request')
                if request:
                    representation['image'] = request.build_absolute_uri(instance.image.url)
                else:
                    representation['image'] = f"/{url}"
        return representation
