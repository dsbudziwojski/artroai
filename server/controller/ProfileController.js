import {PrismaClient} from "../generated/prisma/index.js";
const prisma = new PrismaClient();
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
import express from "express";

const openai= new OpenAI({
    apiKey: process.env.OpenAI_API_KEY,
});

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

export const editProfile = async (req, res) => {
    const username = req.params.username
    const { first_name, last_name, bio } = req.body
    try {
        if (first_name === null && last_name === null && bio === null) {
            throw new Error("No changes were provided")
        }
        await validateUser(username)
        const old_profile = await prisma.user_profile.findUnique({
            where: {username: req.params.username}
        })
        if (old_profile === null) {
            throw new Error("No profile exists")
        }
        let new_data = {
            first_name:  old_profile.first_name,
            last_name: old_profile.last_name,
            bio: old_profile.bio
        }
        if (first_name != null){
            new_data.first_name = first_name
        }
        if (last_name != null) {
            new_data.last_name = last_name
        }
        if (bio != null) {
            new_data.bio = bio
        }
        const profile = await prisma.user_profile.update({
            where: {
                username
            },
            data: new_data
        })
        res.status(200).json({profile: profile})
    } catch (error) {
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

export const generateProfileImage = async (req, res) => {
    try {
        const { prompt, created_by } = req.body;

        if(!prompt || prompt.trim() === '') {
            console.warn("Missing prompt");
            throw new Error("Prompt required");
        }

        if(!created_by || prompt.trim() === '') {
            console.warn("Missing created_by");
            throw new Error("username is required");
        }

        const response= await openai.images.generate({
            prompt,
            n:1,
            size: '256x256',
            response_format: 'b64_json',
        });
        if (!response || !response.data || !response.data[0]?.b64_json) {
            throw new Error("Invalid response from OpenAI image generation");
        }

        const base64imag= response.data[0].b64_json;
        console.log("Image received from OpenAI");

        const dir=path.join(__dirname,'..', 'generated_images');

        const fullFilePath= saveBase64Im(base64imag, dir);
        const fileName= path.basename(fullFilePath);

        const profileImagePath=`/api/generated-images/${fileName}`;
        res.status(200).json({path: profileImagePath});
    }
    catch(error) {
        console.error('Error generating profile image: ', error);
        res.status(400).json({errorMsg: error.message});
    }
};

export const generateImage = async (req, res) => {
    console.log("✅ generateImage route hit");

    try {
        // TODO
        const { prompt, created_by } = req.body;
        console.log("📥 Incoming request body:", req.body);
        
        if(!prompt || prompt.trim() === '') {
            console.warn("❌ Missing prompt");
            throw new Error("Prompt required");
        }

        if(!created_by || prompt.trim() === '') {
            console.warn("Missing created_by");
            throw new Error("username is required");
        }


        //call api to create images
        console.log("🔮 Sending image generation request to OpenAI...");
        const response= await openai.images.generate({
            prompt,
            n:1,
            size: '512x512',
            response_format: 'b64_json',

        });

        if (!response || !response.data || !response.data[0]?.b64_json) {
            throw new Error("Invalid response from OpenAI image generation");
        }
        

        //console.log(response.data[0].b64_json) //get the output of the api for testing

        const base64imag= response.data[0].b64_json;
        console.log("Image received from OpenAI");

        const dir=path.join(__dirname,'..', 'generated_images');

        //store image as filepath

        const fullFilePath= saveBase64Im(base64imag, dir); //call func
        const fileName=path.basename(fullFilePath);

        // const relFilePath=path.relative(process.cwd(), fullFilePath);
        // console.log("💾 Image saved to:", relFilePath);
        const publicURLPath=`/api/generated-images/${fileName}`;

        //generate hashtag response

        const hashtagResponse=await openai.chat.completions.create({
            model: 'gpt-4',
            messages:[
                {role: 'system', content: 'You are a helpful assistant that generates hashtags.'},
                {role: 'user', content: `Generate 3 unique relevant hashtags for the following prompt no longer than 7 characters: "${prompt}`},
            ],
            max_tokens:21,
            temperature: 0.7,

        });

        

        //to get just imag generation comment all hashtag related stuff and created by from request body

        const hashtags= hashtagResponse.choices[0].message.content.trim();
        console.log(hashtags);//check if generating hashtags occurs
        console.log("🏷️ Hashtags generated:", hashtags);

        const savedImage= await prisma.image.create({
            data:{
                prompt,
                path: publicURLPath,
                hashtags,
                created_by,

            },

        });
        console.log("✅ Image metadata saved to database");

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
    const user_id = req.params.username
    const { following_id } = req.body
    try {
        if (user_id === "" || following_id === "") {
            throw new Error("required input was not valid")
        }
        await validateUser(user_id)
        await validateUser(following_id)
        const following = await followersOrFollowingList(user_id, "following")
        const a = following.some(f => f.following_id === following_id);
        if (a) {
            throw new Error("Already following");
        }

        await prisma.follower.create({
            data: {
                user_id: user_id,
                following_id: following_id
            },
        })
        const updated = await followersOrFollowingList(user_id, "following")
        res.status(200).json({following: updated, count: updated.length})
    } catch (error) {
        res.status(400).json({errorMsg: error.message})
    }
}

export const unfollowOther = async (req, res) => {
    const user_id = req.params.username
    const {following_id} = req.body
    try {
        if (user_id === "" || following_id === "") {
            throw new Error("required input was not valid")
        }
        await validateUser(user_id)
        await validateUser(following_id)
        await prisma.follower.deleteMany({
            where:{
                user_id: user_id,
                following_id: following_id
            }
        })
        const following= await followersOrFollowingList(user_id, "followers")
        res.status(200).json({following: following, count: following.length})
    } catch (error) {
        res.status(400).json({errorMsg: error.message})
    }
}


export const allUsersAndImages = async (req, res) => {
    const username = req.username
    try {
        const images = await prisma.image.findMany()
        const users = await prisma.user_profile.findMany()

        res.status(200).json({images: images, users: users})
    }
    catch (error) {
        res.status(404).json({errorMsg: error.message})
    }
}

export const getPublicImages = async (req, res) => {
    const username = req.params.username
    try {
        await validateUser(username)
        const images = await prisma.image.findMany({
            orderBy: {
                date_created: 'desc'
            }
        })
        res.status(200).json({images: images})
    }
    catch (error) {
        res.status(404).json({errorMsg: error.message})
    }
}

export const getFollowingImages = async (req, res) => {
    const username = req.params.username
    try {
        await validateUser(username)
        const following = await followersOrFollowingList(username, "followers")
        if (!following || following.length === 0) {
            return res.status(200).json({ images: [] });
        }
        const followingUsernames = following.map(record => record.following_id);
        const followingImages = await prisma.image.findMany({
            where: {
                created_by: { in: followingUsernames }
            },
            orderBy: {
                date_created: 'desc'
            }
        })
        res.status(200).json({images: followingImages})
    }
    catch (error) {
        res.status(404).json({errorMsg: error.message})
    }
}