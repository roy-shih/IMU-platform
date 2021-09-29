from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('get_api/<str:device_id>', views.GetAPI, name='get_data'),
    path('post_api/', views.PostAPI, name='update'),
]
