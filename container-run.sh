#!/bin/bash

sudo docker run -v pb_data:/app/pb/pb_data:rw --network=nginx-proxy_default --name=nexus ghcr.io/xi72yow/n47ur3n3xu5:latest

# this file is temporary, until I figure out how to get the docker-compose.yml to work