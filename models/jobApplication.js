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
}, 
{
    timestamps: true,
    toObject: {virtuals: true,},
    toJSON: {virtuals: true,},
  })


userJobSchema.pre(/^findOne/, function (next) {
    this.populate({
      path: "userId",
    });
    next();
  });

const JobApplication = mongoose.model('UserJob', userJobSchema);

module.exports = JobApplication;