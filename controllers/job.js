const Job = require('../models/job')
const Profile = require('../models/profile')
const User = require('../models/user')
const CatchAsync = require('../utils/catch-async')
const { getAll, getOne, deleteOne } = require('./generic')

//Creating a Job
exports.createJob = CatchAsync( async (req, res, next) => {
    const payload = req.body

    const employerId = req.user.id

    const job = await Job.create({...payload, employerId})

    res.status(201).json({
        status: 'success',
        data: {
            job
        }
    })
})

//Getting all Jobs
exports.getAllJobs = getAll(Job)
//Getting A Job
exports.getOneJob = getOne(Job)
//Delete A Job
exports.deleteOneJob = deleteOne(Job)

//Update A Job
exports.updateOneJob = CatchAsync(async (req, res, next) => {
    const payload = req.body
    
    const update = await Job.findByIdAndUpdate({...payload})

    res.status(201).json({
        status: 'success',
        data: {update}
    })
})

//Getting Job recommendation
exports.getJobRecommendations = CatchAsync(async (req, res, next) => {
    const userId = req.user.id

    const userProfile = await Profile.findOne({ userId: userId });
    if (!userProfile) {
        return next(new ErrorObject("Please create a profile", 400));
      }

    const jobRecommendations = await Job.find({
            category: userProfile.skills,
            yearsOfExperience: userProfile.yearsOfExperience,
          })

    if(!jobRecommendations){
        return next(
            new ErrorObject("There are no Job(s) that suits your profile", 400)
          )
    }

    res.status(201).json({
        status: 'success',
        message: 'These are recommended jobs',
        results: jobRecommendations.length,
        data: {jobRecommendations}
    })
})

//Getting My Job
exports.getMyJobs = CatchAsync(async (req, res, next) => {
    const userId = req.user.id

    const jobs = await Job.find({employerId: userId})

    if(jobs) {
        return res.status(201).json({
            status: 'success',
            message: 'Below are your jobs',
            results: jobs.length,
            data: {jobs}
        })
    }

    res.status(201).json({
        status: 'success',
        message: 'You have no job'
    })
})