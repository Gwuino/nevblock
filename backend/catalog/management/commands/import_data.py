import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from catalog.models import Category, Product

# Категории из lib/types.ts
CATEGORY_LABELS = {
    "fbs": "ФБС",
    "manipulator": "Услуги манипулятора",
    "rings": "Кольца ЖБИ",
    "shlakoblock": "Шлакоблок",
    "polublok": "Полублок",
    "covers_bottoms": "Крышки и Днища ЖБИ",
}


class Command(BaseCommand):
    help = 'Импорт категорий и товаров из JSON файлов'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Очистить существующие данные перед импортом',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Очистка существующих данных...')
            Product.objects.all().delete()
            Category.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Данные очищены'))

        # Импорт категорий
        self.stdout.write('Импорт категорий...')
        categories_map = {}
        for index, (key, label) in enumerate(CATEGORY_LABELS.items()):
            category, created = Category.objects.get_or_create(
                key=key,
                defaults={'label': label, 'order': index}
            )
            if not created:
                category.label = label
                category.order = index
                category.save()
            categories_map[key] = category
            self.stdout.write(f'  {"Создана" if created else "Обновлена"} категория: {label}')

        # Импорт товаров
        self.stdout.write('Импорт товаров...')
        # Путь к файлу products.json
        # В Docker контейнере файл монтируется в /data, иначе ищем относительно корня проекта
        if os.path.exists('/data/products.json'):
            products_file = '/data/products.json'
        else:
            # Локальная разработка: путь относительно корня проекта (backend/ -> корень проекта)
            base_dir = settings.BASE_DIR.parent
            products_file = os.path.join(base_dir, 'data', 'products.json')

        if not os.path.exists(products_file):
            self.stdout.write(self.style.ERROR(f'Файл {products_file} не найден'))
            return

        with open(products_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            products = data.get('products', [])

        imported_count = 0
        updated_count = 0

        for product_data in products:
            category_key = product_data.get('category')
            if category_key not in categories_map:
                self.stdout.write(
                    self.style.WARNING(f'Пропущен товар {product_data.get("name")}: категория {category_key} не найдена')
                )
                continue

            category = categories_map[category_key]
            product_id = product_data.get('id')
            name = product_data.get('name')
            description = product_data.get('description')
            price = product_data.get('price')
            unit = product_data.get('unit', 'шт')
            order = product_data.get('order', 0)

            # Проверяем, существует ли товар с таким ID
            existing_product = Product.objects.filter(id=product_id).first()

            product_data_dict = {
                'category': category,
                'name': name,
                'description': description if description else None,
                'price': float(price) if price is not None else None,
                'unit': unit,
                'order': order,
            }

            if existing_product:
                # Обновляем существующий товар
                for key, value in product_data_dict.items():
                    setattr(existing_product, key, value)
                existing_product.save()
                updated_count += 1
                self.stdout.write(f'  Обновлен товар: {name}')
            else:
                # Создаем новый товар с указанным ID
                product = Product(
                    id=product_id,
                    **product_data_dict
                )
                product.save()
                imported_count += 1
                self.stdout.write(f'  Импортирован товар: {name}')

        self.stdout.write(self.style.SUCCESS(
            f'\nИмпорт завершен: создано {imported_count} товаров, обновлено {updated_count} товаров'
        ))
