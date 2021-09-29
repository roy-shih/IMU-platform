from django.db import models
from typing import AsyncGenerator

from django.db.models.fields import CharField
from multiselectfield import MultiSelectField
# Create your models here.


class Device(models.Model):
    STATIC_CHOICES = (('右腳踝', u'右腳踝'), ('左腳踝', u'左腳踝'), ('右膝蓋', u'右膝蓋'),
                      ('左膝蓋', u'左膝蓋'), ('右大腿', u'右大腿'), ('左大腿', u'左大腿'), ('腰', u'腰'))
    Device_ID = CharField(max_length=100)
    UUID = CharField(max_length=100)
    Position = models.CharField(
        u"POSITION", choices=STATIC_CHOICES, max_length=32)
    Leader_IP = CharField(max_length=300)

    def __str__(self):
        return self.Device_ID+"-"+self.UUID


class Data(models.Model):
    STATIC_CHOICES = (('右腳踝', u'右腳踝'), ('左腳踝', u'左腳踝'), ('右膝蓋', u'右膝蓋'),
                      ('左膝蓋', u'左膝蓋'), ('右大腿', u'右大腿'), ('左大腿', u'左大腿'), ('腰', u'腰'))
    Device_ID = CharField(max_length=100)
    DATE = models.DateTimeField(auto_now=True, editable=True)
    Position = models.CharField(
        u"POSITION", choices=STATIC_CHOICES, max_length=32)
    UUID = CharField(max_length=100)
    DATA = CharField(max_length=10000)

    def __str__(self):
        return self.Device_ID+"-"+self.UUID+"-"+self.DATE
