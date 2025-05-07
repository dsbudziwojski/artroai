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
           throw new Error("No profile exits")
        }
        res.status(200).json({profile: profile})
    }
    catch (error) {
        res.status(404).json({errorMsg: error.message})
    }
}
