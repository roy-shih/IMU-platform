from django.shortcuts import render
import matplotlib.pyplot as plt
import io
import urllib
import base64
import numpy as np

from django.http import response, HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from models import Device, Data

import uuid
# Create your views here.


def index(request):
    x = np.linspace(-10, 10, 100)
    y = np.sin(x)
    plt.plot(x, y, marker="x")
    fig = plt.gcf()
    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    buf.seek(0)
    string = base64.b64encode(buf.read())
    uri = urllib.parse.quote(string)
    # 建立 3D 圖形
    fig1 = plt.figure()
    ax = fig1.gca(projection='3d')

    # 產生 3D 座標資料
    z1 = np.random.randn(50)
    x1 = np.random.randn(50)
    y1 = np.random.randn(50)
    z2 = np.random.randn(50)
    x2 = np.random.randn(50)
    y2 = np.random.randn(50)

    # 繪製 3D 座標點
    ax.scatter(x1, y1, z1, c=z1, cmap='Reds', marker='^', label='My Points 1')
    ax.scatter(x2, y2, z2, c=z2, cmap='Blues', marker='o', label='My Points 2')

    # 顯示圖例
    ax.legend()
    # plt.plot()
    fig1 = plt.gcf()
    buf1 = io.BytesIO()
    fig1.savefig(buf1, format='png')
    buf1.seek(0)
    string1 = base64.b64encode(buf1.read())
    uri1 = urllib.parse.quote(string1)
    return render(request, 'index.html', {'data': uri, 'data1': uri1})

    pass


@csrf_exempt
def PostAPI(request):
    if request.method == 'POST':
        try:
            payload = json.loads(request.body)
            print(payload)
            DEVICEID = payload['DEVICE_ID']
            # TYPE = payload['TYPE']
            VALUE = str(payload['VALUE'])
            print(DEVICEID, VALUE)
        except:
            DEVICEID = str(request.POST.get('DEVICE_ID'))
            # TYPE = str(request.POST.get('TYPE'))
            VALUE = str(request.POST.get('VALUE'))
            print(DEVICEID, VALUE)
        #find device
        try:
            choose = Device.objects.get(Device_ID=DEVICEID)
        except:
            response = json.dumps([{'Error': 'Data could not be added!'}])
            return HttpResponse(response, content_type='text/json')
        # print(choose)
        # print("old", choose.value)
        choose.DATA = VALUE
        choose.save()
        # print("new", choose.value)
        # response = json.dumps([{'Success': 'Data added successfully!'}])
    return JsonResponse({'DEVICE_ID': DEVICEID, 'VALUE': VALUE}, safe=False)


def GetAPI(request, device_id):
    if request.method == 'GET':
        try:
            choose = Device.objects.get(Device_ID=device_id)
        except:
            # Return UUID and add to DB "device"
            UUID = uuid.uuid4()
            Device.objects.create(
                Device_ID=device_id, UUID=UUID, POSTION="none", Leader_IP="none")

            return JsonResponse({'Device_ID': device_id, 'UUID': UUID}, safe=False)
    return JsonResponse({'Device_ID': choose.Device_ID, 'UUID': choose.UUID, 'position': choose.Position, "Leader_IP": choose.Leader_IP}, safe=False)
