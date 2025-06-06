from functools import wraps
from django.http import JsonResponse


def role_required(required_role):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            user_role = request.META.get('HTTP_USER_ROLE') 
            if user_role not in required_role:
                return JsonResponse({'error': 'Forbidden'}, status=403)
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator
