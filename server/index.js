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

app.get('/api/test', (req, res) => {
  res.json({serverMsg: 'Hello from server!'})
})

app.post('/api/users', createProfile)

app.get('/api/users/:username', getProfile)

app.get('/api/users/:username/images/:image_id', getUniqueImage)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
