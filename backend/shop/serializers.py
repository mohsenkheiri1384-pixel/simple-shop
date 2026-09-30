from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category,Product,OrderItem,Order

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','username','email','first_name','last_name']
        
class RegisterSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True,min_length=6)
    password2=serializers.CharField(write_only=True,min_length=6)
    
    class Meta:
        model=User
        fields=['username','email','password','password2','first_name','last_name']
        
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError('رمز ها یکسان نیستن')
        return data
    def create(self,validated_data):
        validated_data.pop('password2')
        user=User.objects.create_user(**validated_data)
        return user
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields=['id','name','slug','icon']
        
class ProductSerializer(serializers.ModelSerializer):
    category_name=serializers.CharField(source='category.name',read_only=True)
    final_price=serializers.IntegerField(read_only=True)
    is_available=serializers.BooleanField(read_only=True)
    
    class Meta:
        model=Product
        fields=[
            'id','name','category','category_name',
            'description','price','discount','final_price',
            'image','stock','is_available','is_active',
            'created_at','updated_at'
        ]
        read_only_fields=['created_at','updated_at']
        
class OrderItemSerializer(serializers.ModelSerializer):
    product_name=serializers.CharField(source='product.name',read_only=True)
    subtotal=serializers.IntegerField(read_only=True)
    
    class Meta:
        model=OrderItem
        fields=['id','product','product_name','quantity','price','subtotal']
        
class OrderSerializer(serializers.ModelSerializer):
    items=OrderItemSerializer(many=True,read_only=True)
    user_username=serializers.CharField(source='user.username',read_only=True)
    
    class Meta:
        model=Order
        fields=[
            'id','user','user_username','full_name','phone',
            'address','total_price','status','items','created_at'
        ]
        read_only_fields=['user','total_price','status','created_at']
class OrderCreateSerializer(serializers.Serializer):
    full_name=serializers.CharField(max_length=200)
    phone=serializers.CharField(max_length=20)
    address=serializers.CharField()
    items=serializers.ListField(child=serializers.DictField())
    
    class Meta:
        fields=['full_name','phone','address','items']
    
    def create(self,validated_data):
        user=self.context['request'].user
        items_data=validated_data.pop('items')
        
        total=0
        order_items=[]
        for item in items_data:
            try:
                product=Product.objects.get(id=item['product_id'])
            except Product.DoesNotExist:
                raise serializers.ValidationError(f"محصول {item['product_id']} پیدا نشد")
            if product.stock < item['quantity']:
                raise serializers.ValidationError(f"موجودی {product.name} کافی نیست")
            
            price=product.final_price
            total += price * item['quantity']
            order_items.append({
                'product':product,
                'quantity':item['quantity'],
                'price':price,
            })
        order=Order.objects.create(
            user=user,
            total_price=total,
            **validated_data
        )
        
        for item in order_items:
            OrderItem.objects.create(order=order,**item)
            item['product'].stock -=item['quantity']
            item['product'].save()
        return order