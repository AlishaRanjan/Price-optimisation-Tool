
from django.contrib import admin
from django.urls import path
from manageProduct.views import AddDemandForecastView, CategoryListView, ProductListView, ProductView


urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('product/', ProductView.as_view(), name='add-product'),
    path('product/<int:product_id>/', ProductView.as_view(), name='delete-product'),
    path('demand-forecast/', AddDemandForecastView.as_view(), name='add-demand-forecast'),
]
