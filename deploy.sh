#!/bin/bash

[ "$(sudo docker ps -a | grep -c nexus)" -gt 0 ] && sudo docker stop nexus
sudo docker pull ghcr.io/xi72yow/n47ur3n3xu5:latest
[ "$(sudo docker ps -a | grep -c nexus)" -gt 0 ] && sudo docker container rm nexus
[ ! "$(sudo docker ps -a | grep nexus)" ] && sudo docker run -v pb_data:/app/pb/pb_data:rw -v pb_migrations:/app/pb/pb_migrations:rw --network=nginx-proxy_default --name=nexus -d ghcr.io/xi72yow/n47ur3n3xu5:latest
