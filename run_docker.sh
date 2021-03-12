#!/usr/bin/env bash
#run app at localhost:1234


docker run -it --rm \
-v ${PWD}:/app \
-v /app/node_modules \
-p 1234:3000 \
-e CHOKIDAR_USEPOLLING=true \
s403o/playground