const express = require('express')
const { restrictTo, protect } = require('../controllers/auth')
const { 
    getAllApplications,
    createJobApplication,
    getMyJobApplications,
    deleteOneApplication,
    updateJobStatus,
    getOneApplication
} = require('../controllers/jobApplication')
const JobApplication = require('../models/jobApplication')
const User = require('../models/user')

const router = express.Router()


router.get('/applications', protect, restrictTo('employer'), getAllApplications)
router.route('/')
    .post(protect, restrictTo('user'), createJobApplication)
    .get(protect, restrictTo('user'), getMyJobApplications)

    //check here
router.route("/job/:id")
    .get(protect, restrictTo('employer'), getMyJobApplications)
    .delete(protect, restrictTo('employer'), deleteOneApplication)
    .patch(protect, restrictTo('employer'), updateJobStatus)

router.route("/:id")
    .get(protect, getOneApplication)

module.exports = router