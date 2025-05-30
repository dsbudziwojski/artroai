-- AlterTable
CREATE SEQUENCE follower_id_seq;
ALTER TABLE "follower" ALTER COLUMN "id" SET DEFAULT nextval('follower_id_seq');
ALTER SEQUENCE follower_id_seq OWNED BY "follower"."id";
