from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import random, hashlib
import datetime
from userAuth.models import TokenUsers, UserRoles, Users
from django.utils import timezone
from django.db.models import Q
from datetime import timedelta


class LoginView(APIView):
    """
    View for handling user login requests.

    This view authenticates a user based on the provided username and password.
    If the credentials are valid, a token is generated for the user and returned 
    in the response along with the user's role. The token is also saved in the 
    TokenUsers model with a 3-hour expiration time.

    Methods:
        post(request): Authenticates the user and returns a token if successful.
    """

    def post(self, request):
        """
        POST request handler for user login.

        Validates username and password, and returns a token if the credentials are valid.
        If successful, adds the token and user role to the response headers.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A JSON response containing the login details, status, and token.
        """
        try:
            username = request.data['username']
            password = request.data['password']

            try:
                dataFields = Users.objects.get(username=username, password=hashlib.sha512(password.encode()).hexdigest())
                token = hashlib.sha512((username + str(datetime.datetime.now()) + str(random.randint(0, 99999))).encode()).hexdigest()
                id = dataFields.user_id

                expiration_time = timezone.now() + timedelta(hours=3)
                
                try:
                    tokens = TokenUsers.objects.create(user_id=id, token=token, created=timezone.now(), expires_at=expiration_time)
                    
                    user_role = UserRoles.objects.get(user_id=id)  
                    role = user_role.role.name  
                    
                    ret = {
                        'message': 'Login successful',
                        'user_id': tokens.user_id,
                        'created_at': tokens.created,
                        'user_name': username
                    }
                    
                    response = Response(ret, status=status.HTTP_200_OK)
                    response['Authorization'] = f'Bearer {tokens.token}' 
                    response['User-Role'] = role  
                    return response
                
                except Exception as e:
                    return Response({
                        'message': 'Internal server error',
                        'success': 'False'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
            except Users.DoesNotExist:
                return Response({
                    'message': 'Username or password is not correct.',
                    'success': 'False'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({
                'message': 'Values missing in post request',
                'success': 'False',
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    """
    View for handling user registration requests.

    This view allows new users to register by providing a username, password, name, and email.
    The view checks if the username or email already exists before creating a new user.

    Methods:
        post(request): Registers a new user and returns a response with the user details.
    """

    def post(self, request):
        """
        POST request handler for user registration.

        Creates a new user if the provided username and email do not already exist in the database.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A JSON response containing the registration details and status.
        """
        try:
            username = request.data['username']
            password = request.data['password']
            name = request.data['name']
            email = request.data['email']

            existing_user = Users.objects.filter(Q(email=email) | Q(username=username))
            if existing_user.exists():
                user = existing_user.first()
                if user.email == email and user.username == username:
                    return Response({
                        'success': 'false',
                        'message': 'Email and username both already exist',
                    }, status=status.HTTP_400_BAD_REQUEST)
                elif user.email == email:
                    return Response({
                        'success': 'false',
                        'message': 'Email already exists',
                    }, status=status.HTTP_400_BAD_REQUEST)
                elif user.username == username:
                    return Response({
                        'success': 'false',
                        'message': 'Username already exists',
                    }, status=status.HTTP_400_BAD_REQUEST)

            data = Users.objects.create(
                username=username,
                password=hashlib.sha512(password.encode()).hexdigest(),
                name=name,
                email=email,
                created=timezone.now()
            )
            return Response({
                'success': 'True',
                'message': 'User created successfully',
                'user_id': data.user_id,
                'created_at': data.created
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'success': 'false',
                'message': 'Internal error',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class LogoutAPIView(APIView):
    """
    View for handling user logout requests.

    This view allows users to log out by invalidating their authentication tokens.
    It updates the `expired` status of the token to `True` and sets the expiration time.

    Methods:
        post(request): Logs out the user by invalidating the active tokens.
    """

    
    def post(self, request):
        """
        POST request handler for user logout.

        Invalidates the user's active token by setting the `expired` status to `True`.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A JSON response indicating whether the logout was successful.
        """
        user_id = request.headers.get('user_id')

        if not user_id:
            return Response({"error": "User ID not provided"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            TokenUsers.objects.filter(user__user_id=user_id, expired=False).update(
                expired=True, 
                expires_at=timezone.now()
            )
            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except TokenUsers.DoesNotExist:
            return Response({"error": "Token not found or already expired"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)