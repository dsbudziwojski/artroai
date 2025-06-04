# ArtroAI

**Purpose**: This is our creative social media platform, where the main form of communication is through AI-generated art. Instead of traditional posts, users share moments, thoughts, and ideas by turning them into unique digital artwork. The app allows users to explore a dynamic gallery, interact with friends through whom they simply like, and experience daily life in a more expressive and visual way. Our goal is to make everyday sharing more imaginative, fun, and meaningful.

**Target Audience**: Teenagers & Young Adults 

**Technologies**: 
1. Frontend: ReactJS + TailWind (CSS)
2. Backend: NodeJS + Prisma PostgreSQL
3. API: GPT, Firebase

## What is our Art Gallery?
Prompt user to generate AI Art which entails (2) API calls:
1. Create the actual image based on the prompt provided:
2. Create hashtags from the prompt (which will be stored in addition to the username of prompter and name for searching purposes) 

## Setting Up ArtroAI
#### Go to the right directory
```
cd /go/to/.../artroai
```

#### Brew installations
```
# USING SCRIPTS
chmod 754 brew-installs.sh
./brew-installs.sh

-----------------------------------------------

# MANUALLY
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
```

#### Setting up client
```
# USING SCRIPTS
chmod 754 set-up-client.sh
./set-up-client.sh # this includes "brew services start postgresql"

-----------------------------------------------

# MANUALLY
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

---------NOTE---------
# to start postgresql service
brew services start postgresql

# to stop postgresql service
brew services stop postgresql


```

#### Setting up the database
```
# create database called artroai_db
# connects as default user (homebrew defaults to macOS username)
createdb artroai_db

# verify that artroai_db exists
psql -l

# check connectivuty
psql artroai_db 
# prompts psql commandline

# enter on psql commandline
SELECT current_user, current_database(); -- should confirm things

# add DATABASE_URL to server.env (there should be a place for it already that has "")
# replace <username> with your usernamae seen in prompting earlier
DATABASE_URL="postgresql://<USERNAME>@localhost:5432/artroai_db?schema=public"

-----------------------------------------------
# .env file for server should look like:

DATABASE_URL=
OPENAI_API_KEY="ALREADY_THERE_"
FIREBASE_PROJECT_ID="ALREADY_THERE_"
FIREBASE_CLIENT_EMAIL="ALREADY_THERE_"
FIREBASE_PRIVATE_KEY="ALREADY_THERE_"

# .env file for client should already be there
```

#### Setting up server
```
# USING SCRIPTS
chmod 754 set-up-server.sh
./set-up-server.sh

-----------------------------------------------

# MANUALLY
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

```

#### Populating seed data
```
# MANUAL -- no scripts :(
echo -e "POPULATING SEED DATA!"
psql artroai_db -U <username> -f ./seed-data.sql
echo -e "COMPLETED IMPORTING SEED DATA!"

-----------------------------------------------

# if psql artroai_db -U <username> -f ./seed-data.sql errors
# try to use the database_url in place of <username>
```

## Running ArtroAI
#### Go to the right directory
```
cd /go/to/.../artroai
```
#### Make sure that postgres is running
```
brew services start postgresql
```

### Open Two Separate Terminals
#### Run server
```
cd server
npm start
```
#### Run client
```
cd client
npm start
```

## Once everything is working
### Accounts already there!
```
email: neo01@example.com
password: Anderson
```

### Create an account!
```
Simply navigate to signup and input your info!
```

## Acknowledgements
We graciously thank the documentation pages for the providing light in a tunnel of unknown. Additionally, we appreciate Firebase for being deceptively hard to set up and causing us to debug for countless hours as well as TailwindCSS for being a forgiving UI helper and making even the least artistic people feel creative. Lastly, we greatly adore GPT for the help in populating the seed data and being a feature that truly allows art to behold everyone equally.