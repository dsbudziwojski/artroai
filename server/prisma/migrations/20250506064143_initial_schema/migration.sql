CREATE TABLE user_profile (
   username       varchar(10) PRIMARY KEY,
   first_name     varchar(25) NOT NULL,
   last_name      varchar(25) NOT NULL,
   bio            text,
   email          varchar(100) NOT NULL,
   date_created   timestamp(3) DEFAULT CURRENT_TIMESTAMP,
   isAdmin        boolean
);

CREATE TABLE image (
   photo_id       int PRIMARY KEY,
   photo_location varchar(100) NOT NULL,
   prompt         text NOT NULL,
   hashtags       text NOT NULL,
   date_created   timestamp(3) DEFAULT CURRENT_TIMESTAMP,
   created_by     varchar(10) NOT NULL
                                REFERENCES user_profile(username)
                                ON DELETE CASCADE
);

CREATE TABLE follower (
   id             int PRIMARY KEY,
   user_id        varchar(10) NOT NULL
                                REFERENCES user_profile(username)
                                ON DELETE CASCADE,
   following_id   varchar(10) NOT NULL
                                REFERENCES user_profile(username)
                                ON DELETE CASCADE,
   date_followed  timestamp(3) DEFAULT CURRENT_TIMESTAMP,
   CONSTRAINT different_people CHECK (user_id <> following_id)
);