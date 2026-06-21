const express = require('express')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

// Serve built React app
app.use(express.static(path.join(__dirname, '../client/dist')))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Catch-all: send React app for client-side routing
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
