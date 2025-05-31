import {PrismaClient} from "../generated/prisma/index.js";
const prisma = new PrismaClient();
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

const feedPage = {

}

const validateUser = async (username) => {
    const user = await prisma.user_profile.findUnique({
        where: {username: username}
    })
    if (user === null) {
        throw new Error("No user exists")
    }
}

const followersOrFollowingList = async(username, whichList) => {
    // assumes valid username
    if (whichList === "following") {
        const following = await prisma.follower.findMany({
            where: {
                following_id: username
            }
        })
        return following
    } else if (whichList === "followers") {
        const followers = await prisma.follower.findMany({
            where: {
                user_id: username
            }
        })
        return followers
    } else {
        console.log("invalid input for whichList")
    }
}

export const createProfile = async (req, res) => {
    const { username, first_name, last_name, bio, email} = req.body
    if (username === "" || first_name === "" ||last_name === "" || email === "" || email === "") {
        throw new Error("required input was not valid")
    }
    try {
        await prisma.user_profile.create({
            data: {
                username: username,
                first_name: first_name,
                last_name: last_name,
                bio: bio,
                email: email,
                isadmin: false
            },
        })
        res.status(200).json({username: username})
    } catch (error) {
        res.status(400).json({errorMsg: error.message})
    }
}

export const getProfile = async (req, res) => {
    try {
        const profile = await prisma.user_profile.findUnique({
            where: {username: req.params.username}
        })
        if (profile === null) {
           throw new Error("No profile exists")
        }
        res.status(200).json({profile: profile})
    }
    catch (error) {
        res.status(404).json({errorMsg: error.message})
    }
}

//decode image rep as b_64 json write to generated_images directory and return full file path
function saveBase64Im(base64Im, directory){
    const buffer= Buffer.from(base64Im, 'base64');
    const filename= `${Date.now()}.png`;
    const filepath=path.join(directory,filename);
    fs.writeFileSync(filepath,buffer);
    return filepath;
}
export const generateImage = async (req, res) => {
    try {
        // TODO
        const { prompt, created_by } = req.body;
        
        if(!prompt || prompt.trim() === '') {
            throw new Error("Prompt required");
        }

        if(!created_by || prompt.trim() === '') {
            throw new Error("username is required");
        }


        //call api to create images
        const response= await openai.images.generate({
            prompt,
            n:1,
            size: '512x512',
            response_format: 'b64_json',
        });

        console.log(response.data[0].b64_json) //get the output of the api for testing

        const base64imag= response.data[0].b64_json;

        const dir=path.join(__dirname,'..', 'generated_images');

        //store image as filepath

        const fullFilePath= saveBase64Im(base64imag, dir); //call func

        const relFilePath=path.relative(process.cwd(), fullFilePath);

        //generate hashtag response

        const hashtagResponse=await openai.chat.completions.create({
            model: 'gpt-4',
            messages:[
                {role: 'system', content: 'You are a helpful assistant that generates hashtags.'},
                {role: 'user', content: `Generate 2 relevant hashtags for the following prompt: "${prompt}`},
            ],
            max_tokens:10,
            temperature: 0.7,

        });

        

        //to get just imag generation comment all hashtag related stuff and created by from request body

        const hashtags= hashtagResponse.choices[0].message.content.trim();
        console.log(hashtags);//check if generating hashtags occurs

        const savedImage= await prisma.image.create({
            data:{
                prompt,
                path: relFilePath,
                hashtags,
                created_by,

            },

        });

        res.status(200).json({image: savedImage});

    }
    catch(error) {
        console.error('Error generating image: ', error);
        res.status(400).json({errorMsg: error.message});
    }
};

export const getUniqueImage = async (req, res) => {
    const image_id = Number(req.params.image_id)
    if (!Number.isInteger(image_id)) {
        res.status(400).json({errorMsg: "Invalid image_id"})
    }
    try {
        const image = await prisma.image.findUnique({
            where: {
                image_id: image_id
            }
        })
        if (image === null) {
            throw new Error("No image exist")
        }
        res.status(200).json({image: image})
    }
    catch (error) {
        res.status(404).json({errorMsg: error.message})
    }
}

export const getImagesForProfile = async (req, res) => {
    const username = req.params.username
    try {
        await validateUser(username)
        const images = await prisma.image.findMany({
            where: {
                created_by: username
            }
        })
        if (images.length === 0) {
            throw new Error("No images exist")
        }
        res.status(200).json({images: images})
    }
    catch (error) {
        res.status(404).json({errorMsg: error.message})
    }
}

export const getPublicImages = async (req, res) => {
    try {
        const publicImages = await prisma.images.findMany(

         )
    }
    catch (error) {
        res.status(404).json({errorMsg: error.message})
    }
}

export const getFollowingImages = async (req, res) => {
    try {
        const followingImages = await prisma.images.findMany({

            })
    }
    catch (error) {
        res.status(404).json({errorMsg: error.message})
    }
}

export const getFollowers = async (req, res) => {
    const username = req.params.username
    try {
        await validateUser(username)
        const followers = await followersOrFollowingList(username, "followers")
        if (followers.length === 0) {
            res.status(200).json({followers: [], count: 0})
        }
        res.status(200).json({followers: followers, count: followers.length})
    }
    catch (error) {
        res.status(404).json({errorMsg: error.message})
    }
}

export const getFollowing = async (req, res) => {
    const username = req.params.username
    try {
        await validateUser(username)
        const following = await followersOrFollowingList(username, "following")
        if (following.length === 0) {
            res.status(200).json({following: [], count: 0})
        }
        res.status(200).json({following: following, count: following.length})
    }
    catch (error) {
        res.status(404).json({errorMsg: error.message})
    }
}

export const followOther = async (req, res) => {
    const username = req.params.username
    const { following_id } = req.body
    try {
        if (username === "" || following_id === "") {
            throw new Error("required input was not valid")
        }
        await validateUser(username)
        await validateUser(following_id)
        await prisma.follower.create({
            data: {
                user_id: username,
                following_id: following_id
            },
        })
        const following = await followersOrFollowingList(username)
        res.status(200).json({following: following, count: following.length})
    } catch (error) {
        res.status(400).json({errorMsg: error.message})
    }
}

export const unfollowOther = async (req, res) => {
    const username = req.params.username
    const { following_id } = req.body
    try {
        if (username === "" || following_id === "") {
            throw new Error("required input was not valid")
        }
        await validateUser(username)
        await validateUser(following_id)
        await prisma.follower.delete({
            where:{
                user_id: username,
                following_id: following_id
            }
        })
        const following= await followersOrFollowingList(username)
        res.status(200).json({following: following, count: following.length})
    } catch (error) {
        res.status(400).json({errorMsg: error.message})
    }
}