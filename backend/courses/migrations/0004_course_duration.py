from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0003_course_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='duration_weeks',
            field=models.PositiveIntegerField(default=12, help_text='Duration in weeks'),
        ),
    ]