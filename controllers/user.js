const User = require("../models/user");
const { signUp, signIn } = require("./auth");
const { getAll, getOne, deleteOne } = require("./generic");

exports.userSignUp = signUp(User);
exports.userSignIn = signIn(User);
exports.getUsers = getAll(User)
exports.getUser = getOne(User)
exports.deleteUser = deleteOne(User)
