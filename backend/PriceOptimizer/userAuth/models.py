from django.db import models
from django.db import models

class Users(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=30)
    password=models.CharField(max_length=512)
    name=models.CharField(max_length=30)
    email=models.EmailField(max_length=30)
    created = models.DateTimeField(auto_now_add=False, editable=False)

class Roles(models.Model):
    role_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=60)
    description = models.TextField(max_length=30)


class Permissions(models.Model):
    permission_id = models.AutoField(primary_key=True)
    name=models.CharField(max_length=200)
    description=models.TextField()


class TokenUsers(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    token = models.CharField(max_length=512)
    created = models.DateTimeField(auto_now_add=False, editable=False)
    expired = models.BooleanField(default=False)
    expires_at = models.DateTimeField(null=True, blank=True)


class UserRoles(models.Model):
    user=models.ForeignKey(Users, on_delete=models.CASCADE)
    role=models.ForeignKey(Roles, on_delete=models.CASCADE)


class PermissionsRoles(models.Model):
    permission=models.ForeignKey(Permissions, on_delete=models.CASCADE)
    role=models.ForeignKey(Roles, on_delete=models.CASCADE)

