const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    companyName: String,
    title: {
        type: String,
        required: [true, 'Please enter a job title']
    },
    category: {
        type: String,
        required: [true, 'Please enter the job category'],
        enum: ['frontend developer', 'backend developer',  'data analyst', 
        'UI/UX designer', 'product manager', 'product designer', 'full stack developer'],
    },
    location: {
        type: String,
        required: [true, 'Please enter the job location'],
        enum: ['lagos', 'Abuja', 'Ogun', 'Lagos Island', 'Lagos mainland']
    },
    address: {
        type: String,
    },
    description: {
        type: String,
        required: [true, 'Please enter the job description'],
    },
    jobType: {
        type: String,
        required: [true, 'Please enter the job type'],
        enum: ['Full Time', 'Part Time'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
})

const Job = mongoose.model('Job', jobSchema)

module.exports = Job