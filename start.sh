#!/bin/bash

# start docker container
cd server && docker-compose down && docker-compose up -d

# setup database
rm -rf src/migrations
cd src && flask db init && flask db migrate && flask db upgrade

# start client
cd ../../client && npm start

# start server in IDE for debugging
