from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['label', 'key', 'order']
    list_editable = ['order']
    list_filter = ['order']
    search_fields = ['label', 'key']
    ordering = ['order', 'label']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'unit', 'order']
    list_editable = ['order']
    list_filter = ['category', 'unit']
    search_fields = ['name', 'description']
    ordering = ['order', 'name']
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'category', 'description')
        }),
        ('Цена и единицы', {
            'fields': ('price', 'unit')
        }),
        ('Сортировка и изображение', {
            'fields': ('order', 'image')
        }),
    )
