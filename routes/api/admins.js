var express = require('express');
var router = express.Router();
var adminsController = require('../../controller/api/admins');
const { middlewareAuthAdmin } = require('../../middleware/auth')
// let multer = require('multer');
// let upload = multer(); //setting the default folder for multer

router.post('/login', adminsController.login);

router.post('/register', adminsController.register);

router.get('/me', middlewareAuthAdmin, adminsController.me);

module.exports = router;