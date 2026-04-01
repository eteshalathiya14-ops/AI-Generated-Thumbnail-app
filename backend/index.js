const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const connection = require('./config/connection')
const userRoutes = require('./routes/user.routes')

const app = express()

// CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
const thumbnailRoutes = require('./routes/thumbnail.routes');
app.use('/api/thumbnails', thumbnailRoutes);
app.use('/api/users', userRoutes)

// DB connect
connection()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})