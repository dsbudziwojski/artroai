import {PrismaClient} from "../generated/prisma/index.js";
const prisma = new PrismaClient();

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


export const generateImage = async (req, res) => {
    try {
        // TODO
    }
    catch {
        res.status(400).json({errorMsg: error.message})
    }
}

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
    try {
        const images = await prisma.image.findMany({
            where: {
                created_by: req.params.username
            }
        })
        if (images === null) {
            throw new Error("No images exist")
        }
        res.status(200).json({images: images})
    }
    catch (error) {
        res.status(404).json({errorMsg: error.message})
    }
}
