from user_management import views
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
     path('register',views.signup,name='register'),
     path('login',views.login,name='login'),
     path('logout',views.logout,name='logout'),
     path('profile/<int:user_id>/', views.profile_view, name='profile_view'),
     path('profile/<int:user_id>/edit/', views.profile_edit, name='profile_edit'),
     path('restaurants/add/', views.create_restaurant, name='create_restaurant'),
     path('restaurants/<int:pk>/', views.delete_restaurant, name='delete_restaurant'),
     path('restaurants/',views.Listrestaurants,name='restaurants'),
     path('restaurants/<int:restaurant_id>/menu_add/', views.create_menu, name='add_menu_item'),
     path('restaurants/<int:restaurant_id>/menu/', views.menu_list, name='menu_list'),
     path('restaurants/<int:restaurant_id>/menu/<int:pk>/', views.delete_menu, name='delete_menu'),
     # path('restaurants/menu_list_all/',views.menu_list_all,name='menu_list_all'),
     path('add_cart_item/',views.add_cart_item,name='add_to_cart'),
     path('cart_list/<int:userId>/',views.list_cart_item,name='cart_list'),
     path('delete_cart_item/<int:pk>',views.delete_cart_item,name='delete_cart_item'),
     path('initiate-payment/', views.initiate_payment, name='initiate-payment'),
     path('clear_cart/<int:user_id>/', views.clear_cart, name='clear_cart'),
     path('create-booking/', views.create_booking, name='create_booking'),
     path('list-bookings/<int:user_id>/', views.list_bookings_by_user, name='list_bookings_by_user'),
     path('booking-pdf/<str:booking_id>/', views.generate_booking_pdf, name='generate_booking_pdf'),
     path('generate-qr-code/', views.sent_email_response, name='generate_qr_code'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)