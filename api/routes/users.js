const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const UsersController = require('../controllers/users');

//status 409 = conflict   422 = unprocessable thing
router.post('/signup', UsersController.user_signup);

//401 = unauthorised
router.post('/login', UsersController.user_login);

//can delete same user forever, no validation for if they exist or not...
router.delete('/:userId', checkAuth, UsersController.user_delete);

module.exports = router;
