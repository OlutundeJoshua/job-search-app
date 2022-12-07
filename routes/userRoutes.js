const express = require('express');
const {
    signUp,
    signIn,
    protect,
    restrictTo,
    forgotPassword,
    resetPassword,
    updatePassword
} = require('../controllers/auth');

const {
    getUsers,
    getUser,
    deleteUser,
    updateUser
} = require('../controllers/user')

const router = express.Router();

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/forgot-password', forgotPassword)
router.patch('/reset-password/:token', resetPassword)
router.patch('/update-password/:id', protect, updatePassword)
router.get('/', protect, restrictTo('admin'), getUsers)
router.route('/:id')
    .get(protect, getUser)
    .delete(protect, deleteUser)
    .patch(protect, updateUser)


module.exports = router;

