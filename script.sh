#! /bin/bash
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt install nodejs -y
sudo apt install npm -y
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
sudo npm install pm2 -g
sudo npm install yarn -g
