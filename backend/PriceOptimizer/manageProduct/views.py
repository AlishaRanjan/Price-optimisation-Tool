import logging
import random
from django.http import JsonResponse
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from PriceOptimizer.Decorator.decorators import role_required
from manageProduct.models import Category, Product
from django.shortcuts import get_object_or_404
from manageProduct.serializer import AddProductSerializer, DemandForecastSerializer, ProductPutSerializer, ProductSerializer



class CategoryListView(APIView):

    @method_decorator(role_required(['Admin', 'Supplier', 'Buyer', 'Support']))
    def get(self, request):
        """
        Handles GET requests to retrieve all categories.

        This view fetches all the categories from the database and returns a JSON response
        containing the 'id' and 'name' of each category.

        If an error occurs during data retrieval, an appropriate error message is returned.
        """
        try:
            categories = Category.objects.all()
            category_names = categories.values_list('name', flat=True)
            category_names_list = list(category_names)
            logging.info(f"Successfully fetched category data")
            return JsonResponse({'categories':category_names_list}, status=200)
        except Exception as e:
            logging.error(f"Error fetching categories: {e}")
            return JsonResponse({'error': 'An error occurred while fetching categories'}, status=500)
        

class ProductListView(APIView):
    """
    API to fetch all products for a specific user with optimized database queries.
    Uses select_related to minimize the number of database calls.
    """
    
    @method_decorator(role_required(['Admin', 'Supplier', 'Buyer', 'Support']))
    def get(self, request, *args, **kwargs):
        """
        Handles GET requests to list all products for a specific user.
        The user ID is expected in the request headers.
        """
        try:
            user_id = request.headers.get('User-ID') 
            
            if not user_id:
                return JsonResponse({'error': 'User-ID header missing'}, status=400)
            
            products = Product.objects.select_related('category').filter(auth0_user_id=user_id).order_by('-modified_dt')
            serializer = ProductSerializer(products, many=True)

            logging.info(f"Successfully fetched Product List for user_id: {user_id}")
            return JsonResponse(serializer.data, safe=False, status=200)

        except Exception as e:
            logging.error(f"Error fetching products for user_id {user_id}: {e}")
            return JsonResponse({'error': 'An error occurred while fetching products'}, status=500)

class ProductView(APIView):
    """
    API to add a new product and delete an existing product. 
    """
    def generate_optimized_price(self, cost_price: float, selling_price: float) -> float:
        """
        Generate a random price between cost price and selling price
        """
        if cost_price >= selling_price:
            raise ValueError("Cost price should be less than the selling price")
        optimized_price = round(random.uniform(cost_price, selling_price), 2)
        return optimized_price
    
    @method_decorator(role_required(['Admin', 'Supplier', 'Support', 'Buyer']))
    def post(self, request):
        """
        Handles the creation of a new product.
        If the category does not exist, it will create the category and then the product.
        """
        try:
            user_id = request.META.get('HTTP_USER_ID')
            if not user_id:
                return JsonResponse({'error': 'User ID not found in headers'}, status=400)
            
            request_data = request.data.copy()
            request_data['auth0_user_id'] = user_id
            request_data['customer_rating']= random.randint(1, 5)
            request_data['optimized_price']= self.generate_optimized_price(float(request_data.get('cost_price', 0)), float(request_data.get('selling_price', 0)))
            serializer = AddProductSerializer(data=request_data)
            if serializer.is_valid():
                serializer.save()
                logging.info(f"Successfully Created Product Entry")
                return JsonResponse({},status=201)
            
            logging.error(f"An error ocuured: {serializer.errors}")
            return JsonResponse(serializer.errors, status=400)
        except Exception as e:
            logging.error(f"Error fetching products: {e}")
            return JsonResponse({},status=500)
        

    @method_decorator(role_required(['Admin', 'Supplier', 'Support']))
    def delete(self, request, product_id):
        """
        Deletes the product with the given product_id and its associated demand forecast entries.
        """
        try:
            product = Product.objects.get(id=product_id)
            if not product:
                logging.error(f"Product not found")
                return JsonResponse({"error": "Product not found"}, status=404)
            product.delete()
            logging.info(f"Product and associated demand forecasts deleted successfully")
            return JsonResponse({"message": "Product and associated demand forecasts deleted successfully"}, status=200)
        except Exception as e:
            logging.error(f"Error fetching products: {e}")
            return JsonResponse({},status=500)
        

    @method_decorator(role_required(['Admin', 'Supplier', 'Support']))
    def put(self, request, product_id):
        """
        Handles partial updates to a Product instance.
        
        Parameters:
        - request: The incoming HTTP request with potential updates for a Product.
        - product_id: The ID of the Product to be updated.
        
        If the 'category' field is provided in the request, the method checks if the category exists.
        If it exists, the category ID is used for the update. If it doesn't exist, a new category is created
        and the ID of the newly created category is used.
        """
        try:
            product = get_object_or_404(Product, pk=product_id)
            logging.info(f"Product with ID {product_id} retrieved successfully.")

            category_name = request.data.get('category_name')
            if category_name:
                category, created = Category.objects.get_or_create(name=category_name)
                request.data['category'] = category.id
                if created:
                    logging.info(f"Category '{category_name}' created and assigned to product.")
                else:
                    logging.info(f"Category '{category_name}' found and assigned to product.")
            
            serializer = ProductPutSerializer(product, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                logging.info(f"Product with ID {product_id} updated successfully.")
                return JsonResponse({}, status=200)
            else:
                logging.error(f"Validation error when updating product with ID {product_id}: {serializer.errors}")
                return JsonResponse({'error': serializer.errors}, status=400)
        except Exception as e:
            logging.error(f"An error occurred while updating product with ID {product_id}: {str(e)}")
            return JsonResponse({'error': 'An error occurred during the update process. Please try again later.'}, status=500)
        

class AddDemandForecastView(APIView):
    """
    API to add demand forecasts for multiple products. The forecast values are automatically generated.
    """

    @method_decorator(role_required(['Admin', 'Supplier', 'Buyer', 'Support']))
    def post(self, request):
        """
        Handles the creation of new demand forecasts for given product IDs.
        The product IDs are taken from the request body, and the user is taken from the request header.
        A random forecast value is generated for each product.
        """
        try:
            user_id = request.META.get('HTTP_USER_ID')
            if not user_id:
                return JsonResponse({'error': 'User ID not found in headers'}, status=400)
            
            product_id_list = request.data.get('product_id_list')
            if not product_id_list or not isinstance(product_id_list, list):
                return JsonResponse({"error": "Product ID list is missing or invalid"}, status=400)

            products = Product.objects.filter(id__in=product_id_list)
            if not products.exists():
                return JsonResponse({"error": "No products found for the provided IDs"}, status=404)

            created_forecasts = []
            for product_id in product_id_list:
                forecast_data = {
                    'product': int(product_id),  
                    'forecast_value': round(random.uniform(50, 500), 2), 
                    'created_by': user_id
                }
                serializer = DemandForecastSerializer(data=forecast_data)
                if serializer.is_valid():
                    serializer.save()
                    logging.info(f"Successfully created demand forecast for product ID {product_id}")
                    created_forecasts.append(serializer.data)
                else:
                    logging.error(f"Error with product ID {product_id}: {str(serializer.errors)}")
                    created_forecasts.append({product_id: product_id})

            if created_forecasts:
                logging.info(f"Successfully created demand forecasts for all product IDs")
                return JsonResponse({
                    "created_forecasts": created_forecasts,
                }, status=201)
            else:
                logging.error(f"No forecasts were created. Check product IDs or data.")
                return JsonResponse({
                    "error": "No forecasts were created. Check product IDs or data.",
                }, status=400)
        except Exception as e:
            logging.error(f"Error creating demand forecasts: {e}")
            return JsonResponse({"error": "Internal server error"}, status=500)