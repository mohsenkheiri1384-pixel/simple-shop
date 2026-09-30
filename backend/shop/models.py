from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


class Category(models.Model):
    name=models.CharField(max_length=100,unique=True)
    slug=models.SlugField(max_length=100,unique=True,blank=True)
    icon=models.CharField(max_length=50,blank=True,help_text="اسم آیکون از react-icons")
    created_at=models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name="دسته بندی"
        verbose_name_plural="دسته بندی ها"
        ordering=['name']
        
    def save(self,*args,**kwargs):
            if not self.slug:
                self.slug=slugify(self.name)
            super().save(*args,**kwargs)
        
    def __str__(self):
            return self.name
        
class Product(models.Model):
    name=models.CharField(max_length=200)
    category=models.ForeignKey(
    Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name='products'
    )
    description=models.TextField(blank=True)
    price=models.DecimalField(max_digits=10,decimal_places=0)
    discount=models.PositiveIntegerField(default=0,help_text='takhfif 0 ta 100')
    image=models.ImageField(upload_to='products/',blank=True,null=True)
    stock=models.PositiveIntegerField(default=0)
    is_active=models.BooleanField(default=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
        
    class Meta:
        verbose_name="محصول"
        verbose_name_plural="محصولات"
        ordering=['-created_at']
    def __str__(self):
        return self.name
    @property
    def final_price(self):
        if self.discount>0:
            return int(self.price*(100-self.discount)/100)
        return self.price
    @property
    def is_available(self):
        return self.stock>0 and self.is_active
        
class Order(models.Model):
    STATUS_CHOICES=[
        ('pending','در انتظار تایید'),
        ('confirmed','تایید شده'),
        ('sent','ارسال شده'),
        ('delivered','تحویل داده شده'),
        ('canceled','لغو شده'),
    ]
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name='orders')
    full_name=models.CharField(max_length=200)
    phone=models.CharField(max_length=20)
    address=models.TextField()
    total_price=models.DecimalField(max_digits=12,decimal_places=0)
    status=models.CharField(max_length=20,choices=STATUS_CHOICES,default='pending')
    created_at=models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name='سفارش'
        verbose_name_plural="سفارش ها"
        ordering=['-created_at']
        
    def __str__(self):
        return f"سفارش #{self.id} - {self.user.username}"

class OrderItem(models.Model):
    order=models.ForeignKey(Order,on_delete=models.CASCADE,related_name='items')
    product=models.ForeignKey(Product,on_delete=models.SET_NULL,null=True)
    quantity=models.PositiveIntegerField(default=1)
    price=models.DecimalField(max_digits=10,decimal_places=0,help_text="قیمت لحظه ی خرید")
    
    class Meta:
        verbose_name="آیتم سفارش"
        verbose_name_plural="آیتم های سفارش"
        
    def __str__(self):
        return f"{self.product.name if self.product else 'محصول حذف شده'} x {self.quantity}"
    
    @property
    def subtotal(self):
        return self.price * self.quantity