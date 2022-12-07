const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const CatchAsync = require('../utils/catch-async')
const ErrorObject = require('../utils/error')
const sendEmail = require('../utils/email')

//Token Generation
const { JWT_COOKIE_EXPIRES_IN, JWT_EXPIRES_IN, JWT_SECRET } = process.env

const signToken = (id) => {
  return jwt.sign({id}, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

const createAndSendToken = CatchAsync(async (user, statusCode, res) => {
  const token = await signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000)
  }
  
  if (NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
        user,
    },
  })
})


//Sign Up
exports.signUp = (Model) => async (req, res, next) => {
    try{
            const{
                fullName,
                email,
                password,
                passwordConfirm,
                phoneNumber,
                role,
            } = req.body

            if(password !== passwordConfirm){
                return res.status(400).json({message: 'Password and Password Confirm is not the same'})
            }

            const user = await Model.create({
                fullName,
                email,
                password,
                passwordConfirm,
                phoneNumber,
                role,
            })
            
            createAndSendToken(user, 201, res)
        }catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}



//SignIn
exports.signIn = (Model) => async (req, res) => {
    try{
        const {email, password} = req.body
        if(!email || !password) {
            return res.status(401).json({
                status: 'fail',
                message: "Please Input a valid Email or Password"
            })
        }

        const user = await Model.findOne({email}).select('+password')
        const confirmPassword = await bcrypt.compare(password, user.password)
        if(!user || !confirmPassword) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid email or password",
            });
        }

        res.status(200).json({
            status: 'success',
            data: user,
        })
        
        }
    catch(err) {
            res.status(400).json({
                status: 'fail',
                message: err
            })
        }
}


//Forgot Password
exports.forgotPassword = CatchAsync(async (req, res, next) => {
    //Getting user through email
    const user = await User.findOne({email: req.body.email})
    if(!user) {
        return next(
            new ErrorObject('No User with this email', 404)
        )
    }

  //Generating random reset token
  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  //Sending token to the email addess
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/reset-password/${resetToken}`

  const message = `To reset your password click on the link below to submit your new password: ${resetUrl}`

  try {
    await sendEmail({
      message,
      email: user.email,
      subject: "Your password reset url. It's valid for 10mins",
    })

    res.status(200).json({
      status: "success",
      message: "Token has been sent to your mail",
      resetUrl,
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordTokenExpires = undefined
    await user.save()
    next(new ErrorObject("Error while sending the token to your mail", 500))
  }
})


//Rest Password
exports.resetPassword = CatchAsync(async (req, res, next) => {
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordTokenExpires: { $gt: Date.now() },
  })
  if (!user) {
    return next(new ErrorObject("Token is invalid or it has expired", 400))
  }

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordTokenExpires = undefined
  user.passwordChangedAt = Date.now() - 1000
  await user.save()

  createAndSendToken(user, 200, res)
})


//Update Password
exports.updatePassword = CatchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password")
  const { newPassword, newPasswordConfirm } = req.body
  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ErrorObject("Your password is incorrect", 401))
  }

  user.password = newPassword
  user.passwordConfirm = newPasswordConfirm
  await user.save()

  createAndSendToken(user, 200, res)
})

//Authentication
exports.protect = CatchAsync(async (req, res, next) => {
  let token
  if (req.heaaders.authorization &&req.headers.authorization.startWith("bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }
  if (!token) {
    return next(
      new ErrorObject("You are not logged in.Kindly Login or SignUp", 401)
    )
  }
  const decodedToken = await jwt.verify(token, JWT_SECRET)
  const currentUser = await User.findbyId(decodedToken.id)
  req.user = currentUser;
  next()
})

// Authorization
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorObject("You are not authorised to perform this action.", 403)
      )
    }
    next()
  }
}
