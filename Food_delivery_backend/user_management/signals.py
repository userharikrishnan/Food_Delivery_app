from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Customer

# @receiver(post_save, sender=User)
# def create_customer_profile(sender, instance, created, **kwargs):
#     if created:
#         if not hasattr(instance, 'customer'):
#             Customer.objects.create(user=instance, username=instance.username)
