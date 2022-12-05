const mongoose = required('mongoose')

const userJobSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: [true, 'User Id is required'],
    },
    job_id: {
        type: String,
        required: [true, 'Job Id is required'],
    },
    status: {
        type: String,
        enum: ['applied', 'shortlisted', 'rejected']
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
})

const UserJob = mongoose.model('UserJob', userJobSchema);

module.exports = UserJob;