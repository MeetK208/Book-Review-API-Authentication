import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
    },
    lastName: {
      type: String,
      required: [true, "LastName is Required"],
    },
    middleName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      validate: [validator.isEmail, "Invalid Email"],
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
      minlength: 6,
      maxlength: 12,
      select: false, // Generally, you don't want to return password in queries
    },
    mobileNumber: {
      type: String, // Changed to String to handle various formats
      required: [true, "Mobile Number is Required"],
    },
    location: {
      type: String,
      default: "India",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// JSON WebToken
userSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
};

// Compare Password
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

export default mongoose.model("User", userSchema);
