from django.urls import path,include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router=DefaultRouter()
router.register('categories',views.CategoryViewSet,basename='category')
router.register('products',views.ProductViewSet,basename='product')
router.register('orders',views.OrderViewSet,basename='order')

urlpatterns = [
    path('auth/register/',views.register,name='register'),
    path('auth/login/',views.login,name='login'),
    path('auth/refresh/',TokenRefreshView.as_view(),name='token_refresh'),
    path('auth/me/',views.me,name='me'),
]

urlpatterns += router.urls
