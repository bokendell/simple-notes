#!/bin/sh

if [ "$NODE_ENV" = "development" ]; then
  echo "Starting in development mode..."
  yarn dev
else
  echo "Starting in production mode..."
  yarn start
fi
