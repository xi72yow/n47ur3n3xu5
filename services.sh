#!/bin/bash

node server.js &

./pb/pocketbase serve --http=0.0.0.0:8080
