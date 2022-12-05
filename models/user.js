const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please enter your first name']
    },
    lastName: {
        type: String,
        required: [true, 'Please enter your last name']
    },
    middleName: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Please enter an email address'],
        unique: [true, 'A user with this email address already exists'],
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid Email address'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minLength: [8, 'Password must be at least 8 characters'],
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Field is required!'],
        minLength: [8, 'Password must be at least 8 characters'],
          select: false,
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please input your phone number']
    },
    skill: {
        type: String,
        enum: ['frontend developer', 'backend developer',  'data analyst', 'UI/UX designer', 'product manager', 'product designer', 'full stack developer'],
        required: [true, 'Please input your skill']
    },
    experience: {
        type: String,
        emum : ["No experience", "1 year", "2 years", "3 years", "4 and above years"],
    },
    location : {
        type : String,
    },
    role : {
        type : String,
        default : "employee",
        enum : ["employee", "employer", "admin"]
    },
    createdAt : {
        type : Date,
        default : Date.now(),
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User