from django.utils import timezone
from rest_framework import serializers
from .models import DemandForecast, Product, Category


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for Category model.
    Converts Category model instances to JSON representation
    and handles the serialization/deserialization process.
    """
    class Meta:
        model = Category
        fields = ['name']


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer for Product model.
    Converts Product model instances to JSON representation.
    It includes the related CategorySerializer to display the product's category.
    """
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'cost_price', 'selling_price', 'stock_available',
            'units_sold', 'customer_rating', 'optimized_price', 'category'
        ]

    def get_category(self, obj):
        """
        Custom method to get the name of the category for the product.
        Returns None if no category is assigned to the product.
        """
        return obj.category.name if obj.category else None


class AddProductSerializer(serializers.ModelSerializer):
    """
    Serializer to handle adding a new Product.
    This serializer is designed to handle write-only input of category_name.
    It uses the provided category_name to either get or create a category
    and assign it to the new Product instance.
    """
    category_name = serializers.CharField(write_only=True)  

    class Meta:
        model = Product
        fields = ['auth0_user_id', 'name', 'description', 'cost_price', 'selling_price', 'stock_available', 'units_sold', 'customer_rating', 'optimized_price', 'category_name']
    
    def create(self, validated_data):
        """
        Custom create method for adding a product.
        Extracts the category_name from the validated data,
        gets or creates the corresponding Category instance,
        and then creates the Product with the category.
        """
        category_name = validated_data.pop('category_name')
        category, _ = Category.objects.get_or_create(name=category_name)   
        product = Product.objects.create(category=category, **validated_data)  
        return product
    

class DemandForecastSerializer(serializers.ModelSerializer):
    """
    Serializer for DemandForecast model.
    Converts DemandForecast instances to JSON representation.
    Handles creating a new DemandForecast while incrementing the version number automatically.
    """
    class Meta:
        model = DemandForecast
        fields = ['product', 'forecast_value']  

    def create(self, validated_data):
        """
        Custom create method to automatically assign the next version number
        when a new DemandForecast is created for a product.
        It finds the latest version for the given product and increments the version number.
        """
        product = validated_data['product']
        latest_forecast = DemandForecast.objects.filter(product=product).order_by('-version').first()
        new_version = latest_forecast.version + 1 if latest_forecast else 1  
        validated_data['version'] = new_version
        return super().create(validated_data)  
    

class ProductPutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'  
        read_only_fields = ['created_dt', 'modified_dt']  

    def update(self, instance, validated_data):
        validated_data['modified_dt'] = timezone.now()
        return super().update(instance, validated_data)
