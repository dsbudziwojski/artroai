import express from 'express'
import authenticate from './authenticate.js'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  createProfile,
  getProfile,
  getUniqueImage,
  getImagesForProfile,
  generateImage,
  getFollowing,
  getFollowers,
  followOther,
  unfollowOther,
  editProfile,
  getFollowingImages,
  getPublicImages,
  allUsersAndImages,
  generateProfileImage
} from "./controller/ProfileController.js";

const app = express()
const port = process.env.PORT || 5001
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())
app.use('/api/generated-images', express.static(path.join(__dirname, 'generated_images')));

app.post('/api/users', authenticate, createProfile)

app.get('/api/users/:username', authenticate, getProfile)

app.patch('/api/users/:username', authenticate, editProfile)

app.get('/api/users/:username/images/:image_id', authenticate, getUniqueImage)

app.get('/api/users/:username/images', authenticate, getImagesForProfile)

app.get('/api/users/:username/followers', authenticate, getFollowers)

app.get('/api/users/:username/following', authenticate, getFollowing)

app.post('/api/users/:username/follow-other', authenticate, followOther)

app.post('/api/users/:username/unfollow-other', authenticate, unfollowOther)

app.get('/api/users/:username/all-users-and-images', authenticate, allUsersAndImages)

app.get('/api/users/:username/followingImages', authenticate, getFollowingImages)

app.get('/api/users/:username/publicImages', authenticate, getPublicImages)

//def post route for imag gen
app.post('/api/generate-images', authenticate, generateImage)

//def post route fot authetntication
app.post('/api/protected-route', authenticate, (req,res) =>{
  res.status(200).json({message:'Authenticated!', user: req.user});
});

app.post('/api/generate-profile-image', authenticate, generateProfileImage)

// TESTING APIs FOR FRONTEND (while endpoints are still being worked on...)

app.get('/api/test', (req, res) => {
  res.json({serverMsg: 'Hello from server!'})
})

app.get('/api/test/users/:username', (req, res)=>{
  const username = req.params.username
  if (username === "oh-a-cai"){
    const profile = {
      username: username,
      first_name: "Oliver",
      last_name: "Cai",
      bio: "UCLA Com Sci Student",
      email: "ocai@example.com",
      date_created: "2025-05-11 15:11:31.664",
      isadmin: false
    }
    res.status(200).json({profile: profile})
  } else {
    res.status(404).json({errorMsg: "No profile exists"})
  }
})



// END OF TESTING APIs

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
