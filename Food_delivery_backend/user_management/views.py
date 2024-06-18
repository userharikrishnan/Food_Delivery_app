from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from .forms import ExtendedUserCreationForm
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework import status
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import CustomerSerializer, UserSerializer, RestaurantSerializer, MenuSerializer, CartSerializer, OrdersSerializer
from .models import Customer, Restaurant, Menu, Cart, Orders
from django.shortcuts import get_object_or_404
import json
from django.http import JsonResponse
from django.conf import settings
import razorpay
import qrcode
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from django.http import HttpResponse
from django.core.mail import EmailMessage
import logging





#register
logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    form = ExtendedUserCreationForm(request.POST, request.FILES)
    if form.is_valid():
        try:
            user = form.save()
            return Response("Account created successfully", status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating user: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
    

# Login a User

@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if username is None or password is None or email is None:
        return Response({'error': 'Please provide username , email and password'},
                        status=HTTP_400_BAD_REQUEST)
    user = authenticate(username=username, email=email, password=password)

    if not user:
        return Response({'error': 'Invalid Credentials'}, status=HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'id': user.id, 'username': user.username,'email': user.email, 'token': token.key}, status=HTTP_200_OK)



# User Logout

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    if request.method == 'POST':
        request.user.auth_token.delete()
        return Response({'Message': 'You are logged out'},status=status.HTTP_200_OK)


# user profile

@api_view(['GET'])
@permission_classes([AllowAny])
def profile_view(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        customer = Customer.objects.get(user=user)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except Customer.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    user_data = UserSerializer(user).data
    customer_data = CustomerSerializer(customer).data
    profile_data = {**user_data, **customer_data}
    return Response(profile_data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def profile_edit(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        customer = Customer.objects.get(user=user)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except Customer.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.user.id != user.id:
        return Response({"message": "You are not authorized to perform this action."}, status=status.HTTP_403_FORBIDDEN)

    user_serializer = UserSerializer(user, data=request.data, partial=True)
    customer_serializer = CustomerSerializer(customer, data=request.data, partial=True)

    user_serializer.is_valid(raise_exception=True)
    customer_serializer.is_valid(raise_exception=True)

    user_serializer.save()
    customer_serializer.save()

    return Response({**user_serializer.data, **customer_serializer.data})




# add restaurant

@api_view(['POST'])
@permission_classes((AllowAny,))
def create_restaurant(request):
    serializer = RestaurantSerializer(data=request.data)
    if serializer.is_valid():
        instance = serializer.save()
        return Response({'id': instance.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete restaurant
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_restaurant(request, pk):
    restaurant = get_object_or_404(Restaurant, pk=pk)
    restaurant.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

# List restaurants

@api_view(['GET'])
@permission_classes([AllowAny])
def Listrestaurants(request):
    restaurants = Restaurant.objects.all()
    serializer = RestaurantSerializer(restaurants, many=True)
    return Response(serializer.data)


# add menu

@api_view(['POST'])
@permission_classes((AllowAny,))
def create_menu(request, restaurant_id):
    restaurant = get_object_or_404(Restaurant, pk=restaurant_id)
    serializer = MenuSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(restaurant=restaurant)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#list menu

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def menu_list(request, restaurant_id):
    restaurant = get_object_or_404(Restaurant, pk=restaurant_id)
    menus = Menu.objects.filter(restaurant=restaurant)
    serializer = MenuSerializer(menus, many=True)
    return Response(serializer.data)

# delete menu

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_menu(request, restaurant_id, pk):
    restaurant = get_object_or_404(Restaurant, pk=restaurant_id)
    menu = get_object_or_404(Menu, pk=pk, restaurant=restaurant)
    menu.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# menu fetch all

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def menu_list_all(request):
#     menus = Menu.objects.all()
#     serializer = MenuSerializer(menus, many=True)
#     return Response(serializer.data)

# add cart item

@api_view(['POST'])
@permission_classes((AllowAny,))
def add_cart_item(request):
    serializer = CartSerializer(data=request.data)
    if serializer.is_valid():
        instance = serializer.save()
        return Response({'id': instance.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete cart item
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_cart_item(request, pk):
    cart = get_object_or_404(Cart, pk=pk)
    cart.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

#list cart item

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_cart_item(request,userId):
    cart = Cart.objects.filter(user=userId)
    serializer = CartSerializer(cart, many=True)
    return Response(serializer.data)


#razorpay payment


@csrf_exempt
def initiate_payment(request):
    if request.method == "POST":
        try:
            
            data = json.loads(request.body)
            
            client = razorpay.Client(auth=(settings.RAZORPAY_API_KEY, settings.RAZORPAY_API_SECRET))
            
            order_amount = data['amount']
            order_currency = data['currency']
            order_receipt = data['orderId']
            order_notes = {'description': data['description']}
            
            
            order = client.order.create(dict(amount=order_amount, currency=order_currency, receipt=order_receipt, notes=order_notes))
            
            order['order_notes'] = order_notes
            
            return JsonResponse(order, status=200)
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)



#empty cart

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_cart(request, user_id):
    if request.user.is_authenticated:
        Cart.objects.filter(user_id=user_id).delete()
        return JsonResponse({'message': 'Cart cleared successfully'})
    else:
        return JsonResponse({'error': 'Authentication required'}, status=401)


#create booking

@api_view(['POST'])
@permission_classes([AllowAny]) 
def create_booking(request):
    serializer = OrdersSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
def list_bookings_by_user(request, user_id):
    try:
        bookings = Orders.objects.filter(user_id=user_id) 
        serializer = OrdersSerializer(bookings, many=True)
        return Response(serializer.data)
    except Orders.DoesNotExist:
        return Response({'error': 'No bookings found for this user'}, status=404)




# generate pdf with qr

@csrf_exempt
def generate_booking_pdf(request, booking_id):
    if request.method == 'GET':
            
            print(f"Fetching booking with ID: {booking_id}") 
            booking = Orders.objects.get(booking_id=booking_id)

            qr_data = f"Dish: {booking.name},Restaurant: {booking.restaurantName}, Amount: {booking.sumTotal}, Quantity: {booking.count}, Booking ID: {booking.booking_id}, Order date: {booking.booking_date}"
            qr = qrcode.make(qr_data)

            qr_buffer = BytesIO()
            qr.save(qr_buffer, format='PNG')
            qr_buffer.seek(0)
            qr_image = ImageReader(qr_buffer)

            buffer = BytesIO()
            p = canvas.Canvas(buffer, pagesize=letter)
            p.drawImage(qr_image, 100, 500, width=200, height=200)
            p.drawString(100, 450, "Scan this QR to know booking details")
            p.showPage()
            p.save()
            buffer.seek(0)

            
            response = HttpResponse(buffer, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="booking_{booking.booking_id}.pdf"'
            return response
    return HttpResponse('Method not allowed', status=405)




# sent email

@csrf_exempt
def sent_email_response(request):
    if request.method == 'POST':
        
        data = json.loads(request.body)
        dish = data.get('DishName', '')
        restaurant_name = data.get('RestaurantName', '')
        Amount = data.get('Amount', '')
        Quantity = data.get('Quantity', '')
        receipt_id = data.get('receiptId', '')
        email_id = data.get('email', '')
        booking_date = data.get('bookingDate', '')
        


        
        email_body = (f"Movie booked successfully.\n\n"
                      f"Details of your booking:\n"
                      f"Dish: {dish}\n"
                      f"Restaurant: {restaurant_name}\n"
                      f"Booking Date: {booking_date}\n"
                      f"quantity ordered: {Quantity}\n"
                      f"Amount: {Amount}\n"
                      f"Reciept id: {receipt_id}\n")

        
        email = EmailMessage(
            'Booking Details',
            email_body,
            'developmenttesting421@gmail.com',  
            [email_id],
        )
        email.send()

        
        return JsonResponse({'message': 'Email with booking details sent succesfully'})

    return JsonResponse({'error': 'Method not allowed'}, status=405)

