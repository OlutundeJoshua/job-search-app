const mongoose = require('mongoose')
const validator = require('validator')

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'You must be a user to create a profile']
    },
    cv: {
        type: String,
        required: [true, 'User must have a CV']
    },
    skills: {
        type: String,
        enum: ['frontend developer', 'backend developer',  'data analyst', 'UI/UX designer', 'product manager', 'product designer', 'full stack developer'],
        required: [true, 'Please enter your skill']
    },
    yearsOfExperience: {
        type: String,
        required: [true, 'Please enter your years of experience'],
        emum : ["No experience", "1 year", "2 years", "3 years", "4 and above years"],
    },
    location : {
        type : String,
        required: [true, 'Please enter your location']
    },
    linkedlnUrl: {
        type: String,
        validate: {
          validator: (val) => {
            return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
            .test(val);
          },
          message: "Not a url",
        },
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
}, 
    {toObject: {virtuals: true}, toJSON: {virtuals: true}}
)
    
const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile