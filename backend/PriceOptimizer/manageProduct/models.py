from django.db import models
from django.utils import timezone


class BaseModel(models.Model):
    created_dt = models.DateTimeField(default=timezone.now)  
    modified_dt = models.DateTimeField(default=timezone.now)  

    class Meta:
        abstract = True  

class Category(BaseModel):
    name = models.CharField(max_length=255, unique=True)  

    def __str__(self):
        return self.name
    

class Product(BaseModel):
    auth0_user_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    description = models.TextField()
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_available = models.IntegerField()
    units_sold = models.IntegerField()
    customer_rating = models.DecimalField(max_digits=3, decimal_places=1)
    optimized_price = models.DecimalField(max_digits=10, decimal_places=2)

    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)  

    def __str__(self):
        return self.name
    

class DemandForecast(BaseModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)  
    forecast_value = models.DecimalField(max_digits=10, decimal_places=2)
    version = models.IntegerField(default=1)

    class Meta:
        unique_together = ('product', 'version')

    def __str__(self):
        return f"Product: {self.product.name if self.product else 'Deleted Product'}, Version: {self.version}"
    


