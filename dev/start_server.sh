#!/bin/bash

# start docker container
cd ../server && docker-compose down && docker-compose up -d

# setup database
rm -rf src/migrations
cd src && flask db init && flask db migrate && flask db upgrade

# start server
cd .. && pip install -r requirements.txt
cd src && flask run
