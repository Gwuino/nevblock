from django.db import models
from django.core.validators import MinValueValidator


class Category(models.Model):
    """Категория товаров"""
    key = models.CharField(max_length=50, unique=True, verbose_name="Ключ")
    label = models.CharField(max_length=200, verbose_name="Название")
    order = models.IntegerField(default=0, verbose_name="Порядок сортировки")

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"
        ordering = ['order', 'label']

    def __str__(self):
        return self.label


class Product(models.Model):
    """Товар"""
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name="Категория"
    )
    name = models.CharField(max_length=200, verbose_name="Название")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        verbose_name="Цена"
    )
    unit = models.CharField(max_length=20, default="шт", verbose_name="Единица измерения")
    order = models.IntegerField(default=0, verbose_name="Порядок сортировки")
    image = models.ImageField(
        upload_to='products/',
        blank=True,
        null=True,
        verbose_name="Изображение"
    )

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"
        ordering = ['order', 'name']

    def __str__(self):
        return self.name
