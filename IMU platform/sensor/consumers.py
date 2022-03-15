from email import message
import json
from os import stat
from random import randint
from time import sleep
from turtle import right
from channels.generic.websocket import WebsocketConsumer
from django import conf
from .models import *
from asgiref.sync import async_to_sync

data = {
    "state": "Stop",
    "device_right": "",
    "device_left": ""
}


class WSConsumer(WebsocketConsumer):
    def connect(self):
        self.room_group_name = 'test'
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

        self.send(text_data=json.dumps({
            'type': 'control',
            'state': data['state'],
            "device_right": data['device_right'],
            "device_left": data['device_left'],
        }))

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        if text_data_json['type'] == 'control':
            print(text_data_json)
            data['state'] = text_data_json['state']
            data['device_right'] = text_data_json['device_right']
            data['device_left'] = text_data_json['device_left']
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'control_IMU_message',
                    'state': text_data_json['state'],
                    "device_right": text_data_json['device_right'],
                    "device_left": text_data_json['device_left']
                }
            )
        if text_data_json['type'] == 'control_client':
            print(text_data_json)
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'control_client',
                    'name': text_data_json['name'].replace("\t", ""),

                }
            )
        if text_data_json['type'] == 'imu_data':
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'data_render',
                    'device': text_data_json['name'],
                    'data': text_data_json['data'],
                }
            )

    def control_IMU_message(self, event):
        self.send(text_data=json.dumps({
            'type': 'control',
            'state': event['state'],
            "device_right":  event['device_right'].replace("\t", ""),
            "device_left": event['device_left'].replace("\t", ""),
        }))

    def control_client(self, event):
        self.send(text_data=json.dumps({
            'type': 'control_client',
            'name': event['name'],
            # 'device_num': device_num
        }))

    def data_render(self, event):
        self.send(text_data=json.dumps({
            'type': 'data_render',
            'device': event['device'].replace("\t", ""),
            'data': event['data'],
        }))
