#!/bin/sh

echo -e "SETTING UP server's DEPENDENCIES\n"

echo "NAVIGATING TO server"
cd ./server

echo "INSTALLING THINGS FOUND IN package.json"
npm install
echo -e "\n"

echo "INITIALIZING SUPERIOR DATABASE"
npx prisma migrate dev --name init
echo -e "\n"

echo "GENERATING IMPRESSIVE SCHEMA"
npx prisma generate
echo -e "\n"

echo "COMPLETED SETUP!"