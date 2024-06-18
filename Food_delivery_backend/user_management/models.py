from django.db import models
from django.contrib.auth.models import User
import random

class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, default='')
    username = models.CharField(max_length=40)
    mobile = models.CharField(max_length=10, default='')
    address = models.CharField(max_length=150, default='')
    image = models.ImageField(upload_to='profile_images/', default='profile_images/default.jpg')

    def __str__(self):
        return self.user.username


class Restaurant(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Menu(models.Model):
    restaurant = models.ForeignKey(Restaurant, related_name='menus', on_delete=models.CASCADE)
    restaurantName = models.CharField(max_length=50, default='')
    Image_url = models.URLField(max_length=200, default="https://placehold.co/200x250")
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    restaurantName = models.CharField(max_length=50, default='')
    Image_url = models.URLField(max_length=200, default="https://placehold.co/200x250")
    name = models.CharField(max_length=100)
    count = models.DecimalField(max_digits=10, decimal_places=0)
    sumTotal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name


class Orders(models.Model):
    booking_id = models.CharField(max_length=8, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    restaurantName = models.CharField(max_length=50, default='')
    Image_url = models.URLField(max_length=200, default="https://placehold.co/200x250")
    name = models.CharField(max_length=100)
    count = models.DecimalField(max_digits=10, decimal_places=0)
    sumTotal = models.DecimalField(max_digits=10, decimal_places=2)
    booking_date = models.DateField()

    def save(self, *args, **kwargs):
        while True:
            booking_id = ''.join(random.choices('0123456789', k=8))
            if not Orders.objects.filter(booking_id=booking_id).exists():
                self.booking_id = booking_id
                break
        super().save(*args, **kwargs)
    