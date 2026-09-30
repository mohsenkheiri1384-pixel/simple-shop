from django.contrib import admin
from .models import Category,Order,OrderItem,Product
from django.utils.html import format_html

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display=['name','slug','created_at']
    search_fields=['name']
    prepopulated_fields={'slug':('name',)}
    
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display=['image_preview','name','category','price','discount','stock','is_active','created_at']
    list_filter=['category','is_active','created_at']
    search_fields=['name','description']
    list_editable=['price','discount','stock','is_active']
    readonly_fields=['created_at','updated_at']
    
    def image_preview(self,obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" />',obj.image.url)
        return "-"
    image_preview.short_description="photo"
    
    
class OrderItemInline(admin.TabularInline):
    model=OrderItem
    extra=0
    readonly_fields=['price']
    
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display=['id','user','full_name','phone','total_price','status','created_at']
    list_filter=['status','created_at']
    search_fields=['full_name','phone','user__username']
    list_editable=['status']
    inlines=[OrderItemInline]
    readonly_fields=['created_at']
    
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display=['order','product','quantity','price']
    search_fields=['product__name']