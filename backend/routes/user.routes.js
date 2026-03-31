const express = require('express')
const router = express.Router()

const  usercontroller = require('../controller/user.controller')

// Routes
router.post('/register', usercontroller.registeruser)
router.post('/login', usercontroller.loginuser)
router.post('/logout', usercontroller.logoutuser)

module.exports = router