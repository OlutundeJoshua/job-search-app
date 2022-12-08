const Job = require('../models/job')
const JobApplication = require('../models/jobApplication')
const CatchAsync = require('../utils/catch-async')
const { deleteOne } = require('./generic')

//Creating A Job Application
exports.createJobApplication = CatchAsync(async (req, res, next) => {
    const userId = req.user.id
    const {jobId, status} = req.body
    const job = await Job.findOne({jobId})

    if(!job) {
        return res.status(404).json({
            status: 'fail',
            message: 'There is no job with Id ${jobId'
        })
    }

    const jobApplication = await JobApplication.findOne({userId, jobId})

    if(!jobApplication) {
        const jobApplication = await JobApplication.create({
            userId,
            employerId: job.employerId,
            jobId,
            status
        })

        return res.status(201).json({
            status: 'success',
            message: 'You have successfully applied for the job',
            data: {jobApplication}
        })
    }

    res.status(201).json({
        message: 'You have already applied for the job'
    })
})

//Updating Job Status
exports.updateJobStatus = CatchAsync( async (req, res, next) => {
    const employerId = req.user.id
    const employer = await JobApplication.find({employerId})

    if(!employer) {
        return res.status(201).json({
            message: 'Employer Not found'
        })
    }
    await JobApplication.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
    })
    res.status(201).json({
        status: 'status',
        message: 'Data successfully updated'
    })
})

//Getting ALl Applications
exports.getAllApplications = CatchAsync( async (req, res, next) => {
    const employerId = req.user.id

    const jobs = await Job.findOne({employerId})

    if(!jobs) {
        return res.status(401).json({
            message: 'You cannot perform this operation'
        })        
    }
    const applications = await JobApplication.findById(req.params.id)
        res.status(200).json({
            status: 'success',
            data: {
                applications
            }
        })
})

//Getting One Application
exports.getOneApplication = CatchAsync( async (req, res, next) => {
    const userId = req.user.id

    const application = await JobApplication.findById(req.params.id)

    if (userId !== application.userId) {
        return res.status(401).json({
            message: 'You cannot perform this operation'
        })
    }
    res.status(200).json({
        status: 'success',
        data: {application}
    })
})

//Getting A User's Applications
exports.getMyJobApplications = CatchAsync(async (req, res, next) => {
    const userId = req.user.id
    const application = await JobApplication.find({userId})

    res.status(201).json({
        status : 'success',
        message : 'These are your job applications',
        results : application.length,
        data : {
            application
        }
    })
})

//Deleting a Job application
exports.deleteOneApplication = deleteOne(JobApplication)