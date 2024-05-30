#!/bin/bash


# 获取最新代码
git pull origin main

# 运行Docker Compose
sudo docker-compose up --build -d

