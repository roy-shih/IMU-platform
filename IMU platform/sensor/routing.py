from django.urls import path
from .consumers import WSConsumer

ws_urlpatterns = [
    path('ws/imu', WSConsumer.as_asgi()),
]
