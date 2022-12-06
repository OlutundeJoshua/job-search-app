const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please enter your first name']
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
        required: [true, "password is required"],
        select: false,
        minLength: [8, "password must have minimum of 8 characters"],
        validate: {
          validator: function (val) {
            return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])[A-Za-z\d]{8,}/.test(val);
          },
          message:
            "Password must contain at least a number, a lowercase and an uppercase alphabeth",
        },
      },
      passwordConfirm: {
        type: String,
        select: false,
        required: [true, "password is required"],
        validate: {
          validator: function (val) {
            return val === this.password;
          },
          message: "Password and confirm password must be the same",
        },
      },
      passwordResetToken: String,
      passwordChangedAt: Date,
      passwwordTokenExpires: Date,
      active: {
        type: Boolean,
        default: true,
        select: false,
      },
    phoneNumber: {
        type: String,
        validate: {
            validator: function (val) {
              return /[0]{1}[0-9]{10}/.test(val);
            },
            message: "Please enter a valid phone number",
          }
    },
    role : {
        type : String,
        default : "employee",
        enum : ["employee", "employer", "admin"]
    },
    profile:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
      },
    createdAt : {
        type : Date,
        default : Date.now(),
    }
},  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
    let salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = undefined;
  });
  
  userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
  
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.passwwordTokenExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
  };
  
  userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
      console.log(JWTTimeStamp < this.passwordChangedAt);
      return JWTTimeStamp < this.passwordChangedAt;
    }
    return false;
  };

const User = mongoose.model('User', userSchema)

module.exports = User