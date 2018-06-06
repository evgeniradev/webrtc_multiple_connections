#!/bin/bash
docker-compose build $1
docker-compose run --rm webrtc_app npm install
docker-compose run --rm webrtc_app npm run build
