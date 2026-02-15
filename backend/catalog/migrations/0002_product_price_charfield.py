# Generated manually: цена — число или текст

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0001_initial"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            state_operations=[
                migrations.AlterField(
                    model_name="product",
                    name="price",
                    field=models.CharField(
                        blank=True,
                        help_text="Число (например 500) или текст (по запросу, договорная, от 300 ₽)",
                        max_length=100,
                        null=True,
                        verbose_name="Цена",
                    ),
                ),
            ],
            database_operations=[
                migrations.RunSQL(
                    sql="ALTER TABLE catalog_product ALTER COLUMN price TYPE varchar(100) USING (price::text);",
                    reverse_sql="ALTER TABLE catalog_product ALTER COLUMN price TYPE numeric(10,2) USING (NULLIF(trim(price), '')::numeric);",
                ),
            ],
        ),
    ]
