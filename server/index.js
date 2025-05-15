import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import {createProfile, getProfile, getUniqueImage} from "./controller/ProfileController.js";

const app = express()
const port = process.env.PORT || 5001
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())
app.use('/api/generated-images', express.static(path.join(__dirname, 'generated-images')));

app.post('/api/users', createProfile)

app.get('/api/users/:username', getProfile)

app.get('/api/users/:username/images/:image_id', getUniqueImage)

// TESTING APIs FOR FRONTEND (while endpoints are still being worked on...)
app.get('/api/test', (req, res) => {
  res.json({serverMsg: 'Hello from server!'})
})
app.get('api/test/users/:username', (req, res)=>{
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
