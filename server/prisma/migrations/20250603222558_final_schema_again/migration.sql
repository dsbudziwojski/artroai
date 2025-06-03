-- CreateTable
CREATE TABLE "follower" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(25) NOT NULL,
    "following_id" VARCHAR(25) NOT NULL,
    "date_followed" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image" (
    "image_id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "hashtags" TEXT NOT NULL,
    "date_created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(25) NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("image_id")
);

-- CreateTable
CREATE TABLE "user_profile" (
    "username" VARCHAR(25) NOT NULL,
    "first_name" VARCHAR(25) NOT NULL,
    "last_name" VARCHAR(25) NOT NULL,
    "bio" TEXT,
    "email" VARCHAR(75) NOT NULL,
    "date_created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isadmin" BOOLEAN,
    "profile_image_path" TEXT NOT NULL,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("username")
);

-- AddForeignKey
ALTER TABLE "follower" ADD CONSTRAINT "follower_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "user_profile"("username") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "follower" ADD CONSTRAINT "follower_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profile"("username") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user_profile"("username") ON DELETE CASCADE ON UPDATE NO ACTION;
