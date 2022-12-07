const express = require('express')
const { restrictTo, protect } = require('../controllers/auth')
const { createJob, getJobRecommendations, getAllJobs, getMyJobs, getOneJob, updateOneJob, deleteOneJob } = require('../controllers/job')
const Job = require('../models/job')
const User = require('../models/user')

const router = express.Router()

router.post('/create-job', protect, restrictTo('employer') , createJob)
router.get('/', protect, restrictTo('user'), getJobRecommendations)
router.get('/all', protect, getAllJobs)
router.get('/my-jobs', protect, restrictTo('employer'), getMyJobs)

router.route('/:id')
    .get(protect, getOneJob)
    .patch(protect, restrictTo('employer'), updateOneJob)
    .delete(protect, restrictTo('employer'), deleteOneJob)

module.exports = router