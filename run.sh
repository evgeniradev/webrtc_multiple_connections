#!/bin/bash
if [ "$1" = 'down' ]; then
  docker-compose down
elif [ "$1" = 'production' ] || [ "$1" = 'up' ]; then
  docker-compose down
  docker-compose up
elif [ "$1" = 'development' ]; then
  docker-compose down
  docker-compose run --service-ports --rm webrtc_app npm run start
else
  echo 'Unknown command'
fi
