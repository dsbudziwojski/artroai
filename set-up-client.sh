#!/bin/sh

echo "BEGINNING TO SET UP CLIENT DEPENDENCIES"
echo -e "\n"

echo "NAVIGATING TO client"
cd ./client

echo "INSTALLING THINGS FOUND IN package.json"
npm install

echo "ADDING tailwind FOR TANTELIZING DESIGNS"
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init

cd ..
echo "COMPLETED SETTING UP CLIENT DEPENDENCIES"