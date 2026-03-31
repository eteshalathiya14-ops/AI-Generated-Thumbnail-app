const mongoose = require('mongoose')

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL)
    console.log('MongoDB Connected Successfully')
  } catch (error) {
    console.log('MongoDB connection error:', error.message)
  }
}

module.exports = connection