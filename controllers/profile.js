const { findById } = require('../models/job')
const Profile = require('../models/profile')
const User = require('../models/user')
const CatchAsync = require('../utils/catch-async')
const { getAll, getOne, deleteOne } = require('./generic')


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
        new ErrorObject(`There is no user with the id ${req.params.id}`, 400)
      )
    }

      if (req.user.id !== profile.userId.toString()) {
        return next(new ErrorObject("You are not authorised", 403))
      }

    const cv = req.body.cv === undefined ? user.cv : req.body.cv
    const skills = req.body.skills === undefined ? user.skills : req.body.skills
    const address = req.body.address === undefined ? user.address : req.body.address
    const yearsOfExperience = req.body.yearsOfExperience === 
        undefined ? user.yearsOfExperience : req.body.yearsOfExperience
    const linkedlnUrl =
      req.body.linkedlnUrl ===
        undefined ? user.linkedlnUrl : req.body.linkedlnUrl
  
    const update = {
      cv,
      skills,
      address,
      yearsOfExperience,
      linkedlnUrl,
    }
    const updatedProfile = await User.findByIdAndUpdate(req.params.id, update, {
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