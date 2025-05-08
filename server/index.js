import express from 'express'
import { createProfile, getProfile } from "./controller/ProfileController.js";
const app = express()
const port = process.env.PORT || 5001

app.use(express.json())
app.get('/api/test', (req, res) => {
  res.json({serverMsg: 'Hello from server!'})
})

app.post('/api/users', createProfile)

app.get('/api/users/:username', getProfile)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
