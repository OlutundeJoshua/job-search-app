const { findById } = require('../models/job')
const Profile = require('../models/profile')
const User = require('../models/user')
const CatchAsync = require('../utils/catch-async')
const ErrorObject = require('../utils/error')
const { getAll, getOne, deleteOne } = require('./generic')
const cloudinary = require('cloudinary')
const multer = require('multer')

const maxSize = 2 * 1024 * 1024
const multerStorage = multer.diskStorage({})

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("application")) {
    cb(null, true);
  } else {
    cb(new ErrorObject("Please upload only an image file", 400), false);
  }
}

const uploadUserCv = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: maxSize },
})

exports.uploadUserCv = uploadUserCv.single("cv")

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
})

exports.resizeUserCV = CatchAsync(async (req, res, next) => {
  if (req.file) {
    // let user_id = req.user._id;
    let timeStamp = Date.now()
    let userId = req.user.id
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return next(
          new ErrorObject(`There is no user with the is ${req.params.id}`, 400)
        )
      }
      userCv = `${user.fullName}-${timeStamp}`
    }
    userCv = `${req.body.name}-${timeStamp}`
    const result = await cloudinary.v2.uploader.upload(
      req.file.path,
      {use_filename: true, unique_filename: false} ,
      function (error, result) {}
    )
    userCv = result.url
    req.body.cv = userCv
  }

  next()
})


//Get All Profiles
exports.getProfiles = getAll(Profile)

//Get One Profile
exports.getProfile = getOne(Profile)

//Delete A Profile
exports.deleteProfile = deleteOne(Profile)

//Creating a Profile
exports.createProfile = CatchAsync(async (req, res, next) => {
    const userId = req.user.id
    const user = await User.findById(userId)
    if(user.profile) {
      return next(
        new ErrorObject(`You have already created a profile`, 400)
      )
    }
    const {
        cv,
        skills,
        location,
        yearsOfExperience,
        linkedInUrl
    } = req.body
    const profile = await Profile.create({
        userId: userId,
        cv,
        skills,
        location,
        yearsOfExperience,
        linkedInUrl,
    })
    user.profile = profile.id
    await user.save()
    res.status(200).json({
        status: 'success',
        message: 'Profile created succesfully',
        data: profile,
    })
})


// Update A profile
exports.updateprofile = CatchAsync(async (req, res, next) => {
    const profile = await Profile.findById(req.params.id)
    if (!profile) {
      return next(
        new ErrorObject(`There is no profile with the id ${req.params.id}`, 400)
      )
    }

      if (req.user.id !== profile.userId.toString()) {
        return next(new ErrorObject("You are not authorised", 403))
      }

    const cv = req.body.cv === undefined ? profile.cv : req.body.cv
    const skills = req.body.skills === undefined ? profile.skills : req.body.skills
    const address = req.body.address === undefined ? profile.address : req.body.address
    const yearsOfExperience = req.body.yearsOfExperience === 
        undefined ? profile.yearsOfExperience : req.body.yearsOfExperience
    const linkedlnUrl =
      req.body.linkedlnUrl ===
        undefined ? profile.linkedlnUrl : req.body.linkedlnUrl
  
    const update = {
      cv,
      skills,
      address,
      yearsOfExperience,
      linkedlnUrl,
    }
    const updatedProfile = await Profile.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    })
    res.status(200).json({
      status: "success",
      data: {
        profile: updatedProfile,
      },
    })
  })