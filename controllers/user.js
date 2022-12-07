const User = require("../models/user");
const CatchAsync = require("../utils/catch-async");
const ErrorObject = require("../utils/error");
const { signUp, signIn } = require("./auth");
const { getAll, getOne, deleteOne } = require("./generic");


exports.signUpUser = signUp(User)
exports.signInUser = signIn(User)
//Get All Users
exports.getUsers = getAll(User)

//Get One User
exports.getUser = getOne(User)

//Delete User
exports.deleteUser = deleteOne(User)

// Update A User
exports.updateUser = CatchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(
        new ErrorObject(`There is no user with the id ${req.params.id}`, 400)
      );
    }
    if (req.user.id !== req.params.id) {
      return next(new ErrorObject("You are not authorised", 403));
    }
    const email = req.body.email === undefined ? user.email : req.body.email;
    const fullName =
      req.body.fullName === undefined ? user.fullName : req.body.fullName;
    const role = req.body.role === undefined ? user.role : req.body.role;
    const phoneNumber =
      req.body.phoneNumber === undefined ? user.phoneNumber : req.body.phoneNumber;
  
    const update = { email, fullName, phoneNumber, role };
    const updatedUser = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  });
  