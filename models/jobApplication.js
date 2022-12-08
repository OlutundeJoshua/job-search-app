const mongoose = require('mongoose')

const userJobSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'User Id is required'],
    },
    jobId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Job',
        required: [true, 'Job Id is required'],
    },
    status: {
        type: String,
        enum: ['applied', 'shortlisted', 'accepted','rejected']
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
})

const JobApplication = mongoose.model('UserJob', userJobSchema);

module.exports = JobApplication;