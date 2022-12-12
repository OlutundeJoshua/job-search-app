const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    employerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'A job must have an employer']
    },
    companyName: {
        type: String,
        required: [true, 'Please enter a company name']
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
    jobTitle: {
        type: String,
        required: [true, 'Please enter the job title'],
    },
    jobDescription: {
        type: String,
        required: [true, 'Please enter the job description'],
    },
    jobType: {
        type: String,
        required: [true, 'Please enter the job type'],
        enum: ['Full Time', 'Part Time', 'Contract'],
    },
    workType: {
        type: String,
        required: [true, 'Please enter the work type'],
        enum: ['remote', 'hybrid', 'physical'],
    },
    salary: {
        type: String,
    },
    isAvailable: {
        type: Boolean,
        required: [true, "Please enter job availability"],
        default: true,
    },
    yearsOfExperience: {
        type: String,
        required: [true, "please enter year of experience needed"],
        enum: [
          "No experience",
          "1 year",
          "2 years",
          "3 years",
          "4 years",
          "5 years and above",
        ],
      },
    keyword: {
        type: String,
        required: [true, 'Please enter keyword'],
        enum: [
            'frontend', 
            'backend',
            'data analyst',
            'UI/UX designer',
            'NestJs',
            'NodeJs',
            'Javascript',
            'Python',
            'product manager',
            'product designer',
            'full stack',
    ],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
}, {
    timestamps: true,
    toObject: {virtuals: true}, toJSON: {virtuals: true},
  }
)

const Job = mongoose.model('Job', jobSchema)

module.exports = Job