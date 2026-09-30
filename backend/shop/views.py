from rest_framework import viewsets,status,generics
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny,IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter,OrderingFilter

from .models import Category,Product,Order
from .serializers import (
    UserSerializer,RegisterSerializer,
    CategorySerializer,ProductSerializer,
    OrderSerializer,OrderCreateSerializer
)

@api_view(['POST','GET'])
@permission_classes([AllowAny])
def register(request):
    if request.method=='GET':
        return Response({
            'username':'',
            'email':'',
            'password':'',
            'password2':'',
            'first_name':'',
            'last_name':''
        })
    seializer=RegisterSerializer(data=request.data)
    if seializer.is_valid():
        user=seializer.save()
        refresh=RefreshToken.for_user(user)
        return Response({
            'user':UserSerializer(user).data,
            'access':str(refresh.access_token),
            'refresh':str(refresh),
        }, status=status.HTTP_201_CREATED)
    return Response(seializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST','GET'])
@permission_classes([AllowAny])
def login(request):
    if request.method=='GET':
        return Response({
            'username':'',
            'password':''
        })
    username=request.data.get('username')
    password=request.data.get('password')
    
    user=authenticate(username=username,password=password)
    if user is None:
        return Response(
            {'error':'نام کاربری یا رمز اشتباهه'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    refresh=RefreshToken.for_user(user)
    return Response({
        'user':UserSerializer(user).data,
        'access':str(refresh.access_token),
        'refresh':str(refresh),
    })
@api_view(['GET','PUT'])
@permission_classes([IsAuthenticated])
def me(request):
    if request.method=='GET':
        return Response(UserSerializer(request.user).data)
    
    serializer=UserSerializer(request.user,data=request,partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset=Category.objects.all()
    serializer_class=CategorySerializer
    permission_classes=[AllowAny]
    
class ProductViewSet(viewsets.ModelViewSet):
    queryset=Product.objects.filter(is_active=True)
    serializer_class=ProductSerializer
    filter_backends=[DjangoFilterBackend,SearchFilter,OrderingFilter]
    filterset_fields=['category']
    search_fields=['price','created_at','name']
    
    def get_permissions(self):
        if self.action in ['list','retrieve']:
            return[AllowAny()]
        return[IsAdminUser()]
class OrderViewSet(viewsets.ModelViewSet):
    serializer_class=OrderSerializer
    permission_classes=[IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)
    
    def create(self,request,*args,**kwargs):
        serializer=OrderCreateSerializer(data=request.data,context={'request':request})
        if serializer.is_valid():
            order=serializer.save()
            return Response(
                OrderSerializer(order).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)