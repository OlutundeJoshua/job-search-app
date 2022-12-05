const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const CatchAsync = require('../utils/catch-async')
const ErrorObject = require('../utils/error')

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
                firstName,
                lastName,
                middleName,
                email,
                password,
                passwordConfirm,
                phoneNumber,
                skill,
                experience,
                location,
                role,
            } = req.body

            if(password !== passwordConfirm){
                return res.status(400).json({message: 'Password and Password Confirm is not the same'})
            }

            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)

            const user = await Model.create({
                firstName,
                lastName,
                middleName,
                email,
                password: hash,
                passwordConfirm,
                phoneNumber,
                skill,
                experience,
                location,
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
