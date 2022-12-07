const express = require('express')
const { protect, restrictTo } = require('../controllers/auth')
const { createProfile, getProfile, updateprofile, deleteProfile, getProfiles } = require('../controllers/profile')


const router = express.Router()

router.post('/createProfile', protect, restrictTo('user'), createProfile)
router.get('/', restrictTo('admin'), getProfiles)
router.route('/:id')
    .get(protect, getProfile)
    .patch(protect, updateprofile)
    .delete(protect, deleteProfile)

    module.exports = router