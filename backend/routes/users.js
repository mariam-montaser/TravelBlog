const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');

router.post('/signup', userController.siginup);
router.post('/login', userController.login);


module.exports = router