const express = require('express')
const { protect, restrictTo } = require('../controllers/auth')
const { createProfile, getProfile, updateprofile, deleteProfile, getProfiles, uploadUserCv, resizeUserCV } = require('../controllers/profile')


const router = express.Router()

router.post('/createProfile', protect, restrictTo('user'), uploadUserCv, resizeUserCV, createProfile)
router.get('/', protect, restrictTo('admin'), getProfiles)
router.route('/:id')
    .get(protect, getProfile)
    .patch(protect, updateprofile)
    .delete(protect, deleteProfile)

    module.exports = router