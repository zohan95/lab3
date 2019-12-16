from django.db import models


class Quote(models.Model):
    STATUS_CHOICES = (
        ('new', 'новая'),
        ("checked", 'проверена')
    )
    text = models.TextField(max_length=200, verbose_name='Текст')
    name = models.CharField(max_length=63, verbose_name='Имя')
    email = models.CharField(max_length=100, verbose_name='Почта')
    status = models.CharField(max_length=20, verbose_name='Статус', choices=STATUS_CHOICES,
                              default=STATUS_CHOICES[0][0])
    rating = models.IntegerField(default=0, verbose_name='Рейтинг')
    date_create = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    def __str__(self):
        return self.text[:20]

    class Meta:
        ordering = ['-date_create']
