const Job = require('../models/job')
const User = require('../models/user')
const CatchAsync = require('../utils/catch-async')
const { getAll, getOne, deleteOne } = require('./generic')

//Creating a Job
exports.createJob = CatchAsync( async (req, res, next) => {
    const payload = req.body

    const job = await Job.create({...payload})

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

    const user = await User.findById({_id: userId})

    const jobRecommendations = await Job.find({category: user.skill, yearsOfExperience: user.yearsOfExperience})

    if(jobRecommendations){
        return res.status(201).json({
            status: 'success',
            message: 'These are recommended jobs',
            results: jobRecommendations.length,
            data: {jobRecommendations}
        })
    }

    res.status(201).json({
        message: 'Please update your profile to find jobs that match'
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