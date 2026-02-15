import re
from django import forms
from django.contrib import admin
from .models import Category, Product


def slug_from_label(label):
    """Генерирует латинский ключ из названия (русский → транслит)."""
    if not label:
        return ""
    tr = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z',
        'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
        'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    }
    s = label.strip().lower()
    out = []
    for c in s:
        if c in tr:
            out.append(tr[c])
        elif c in ' -_':
            out.append('_')
        elif c.isalnum():
            out.append(c)
    key = re.sub(r'_+', '_', ''.join(out)).strip('_')
    return key[:50] if key else "category"


class CategoryAdminForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['key', 'label', 'order']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['key'].required = False
        self.fields['key'].help_text = "Оставьте пустым — подставится автоматически из названия."


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    form = CategoryAdminForm
    list_display = ['label', 'key', 'order']
    list_editable = ['order']
    list_filter = ['order']
    search_fields = ['label', 'key']
    ordering = ['order', 'label']

    def save_model(self, request, obj, form, change):
        if not (obj.key or '').strip():
            obj.key = slug_from_label(obj.label) or "category"
            # обеспечить уникальность
            base = obj.key
            n = 0
            while Category.objects.filter(key=obj.key).exclude(pk=obj.pk).exists():
                n += 1
                obj.key = f"{base}_{n}"[:50]
        super().save_model(request, obj, form, change)


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
