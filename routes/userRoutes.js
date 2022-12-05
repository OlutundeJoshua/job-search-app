const express = require('express')
const { userSignUp, userSignIn, getUsers, getUser, deleteUser } = require('../controllers/user')

const router = express.Router();

router.post('/signup', userSignUp)
router.post('/signin', userSignIn)
router.get('/', getUsers)
router.route('/:id')
    .get(getUser)
    .delete(deleteUserrs)


module.exports = router;

