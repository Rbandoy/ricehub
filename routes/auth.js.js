const express = require('express')
const router = express.Router()
const auth = require('../middleware/Validator/auth')
const authentication = require('../controller/authentication/auth')

router.post(
  '/refresh',
  authentication.verify,
  // auth.refresh,
  authentication.refresh
)

router.post('/login', authentication.login)

module.exports = router
