import time
from django.utils import timezone
from django.http import JsonResponse
from userAuth.models import TokenUsers
from PriceOptimizer.Exception.custom_exception import TokenValidationError

class TokenValidationMiddleware:
    """
    Middleware that validates the token in the request header.
    
    1. Checks if the token exists.
    2. Verifies if the token is expired.
    3. Ensures that the token sent by the user matches the one stored in the database.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.skip_urls = ['/pot/auth/login/', '/pot/auth/register/']  

    def __call__(self, request):
        if request.path not in self.skip_urls:
            try:
                self.validate_token(request)
            except TokenValidationError as e:
                return JsonResponse({'error': str(e)}, status=401)
        return self.get_response(request)

    def validate_token(self, request):
        """
        Validates the token provided in the Authorization header.
        
        1. Checks if the token exists in the request.
        2. Validates if the token has expired.
        3. Ensures the token matches the one stored in the database.
        
        Raises TokenValidationError if any of the checks fail.
        """
        token = request.headers.get('Authorization')

        if not token:
            raise TokenValidationError("Token is missing in the request")
        
        token = token.replace('Bearer ', '')

        try:
            token_record = TokenUsers.objects.filter(
                token=token,
                user_id=request.headers.get('user_id'),
                expired=False
            ).first()

            if not token_record:
                raise TokenValidationError("Token is invalid or does not exist in the database")

            current_time = timezone.now()
            if token_record.expires_at < current_time:
                token_record.expired = True
                token_record.save()
                raise TokenValidationError("Token has expired")

            request.user_id = token_record.user_id
            request.token = token

        except TokenUsers.DoesNotExist:
            raise TokenValidationError("Token is invalid or does not exist")
