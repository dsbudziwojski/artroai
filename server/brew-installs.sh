#!/bin/sh

echo "CHECKING brew's version"
brew --version
echo -e "\n"

echo "INSTALLING node"
brew install node
echo -e "\n"

echo "VERIFYING node AND npm"
node --version
npm --version
echo -e "\n"

echo "INSTALLING postgres BECAUSE ITS SUPERIOR"
brew install postgresql
echo -e "\n"

echo "STARTING postgres BECAUSE ITS BETTER"
brew services start postgresql
echo -e "\n"

echo "COMPLETED brew INSTALLS"