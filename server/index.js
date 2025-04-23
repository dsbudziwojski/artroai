const express = require('express')
const app = express()
const port = process.env.PORT || 5001

app.get('/test', (req, res) => {
  res.json({serverMsg: 'Hello from server!'})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
