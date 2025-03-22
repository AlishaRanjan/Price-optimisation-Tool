from django.http import JsonResponse
from PriceOptimizer.Exception.custom_exception import UserIDValidationError
from userAuth.models import Users


class UserIDValidationMiddleware:
    """
    Middleware that validates the user ID in the request header and checks it
    against the user ID extracted from the token.

    Skips validation for certain URLs like login and logout.
    Raises UserIDValidationError if the user ID in the header does not match
    the token's user ID or if the user is not found.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.skip_urls = ['/pot/auth/login/', '/pot/auth/register/']  

    def __call__(self, request):
        if request.path not in self.skip_urls:
            try:
                self.validate_user_id(request)
            except UserIDValidationError as e:
                return JsonResponse({'error': str(e)}, status=401)

        return self.get_response(request)

    def validate_user_id(self, request):
        """
        Validates that the user ID in the request header matches the user ID 
        in the token.

        Args:
            request (HttpRequest): The incoming request object containing the 
                                    user_id in the header.

        Raises:
            UserIDValidationError: If the user_id is invalid or not found.
        """
        header_user_id = request.headers.get('user_id')

        if not header_user_id:
            raise UserIDValidationError("User ID is missing from the request")

        if not Users.objects.filter(user_id=header_user_id).exists():
            raise UserIDValidationError("User not found")


