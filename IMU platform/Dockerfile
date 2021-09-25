FROM python:3.9
ENV PYTHONUNBUFFERED 1
RUN mkdir /imu
WORKDIR /imu
COPY requirements.txt /imu/
RUN pip install -r requirements.txt
COPY . /imu/
