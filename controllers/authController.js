import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {
  // try{
  const { name, lastName, email, password, mobileNumber, location } = req.body;
  if (!name || !lastName || !email || !password || !mobileNumber) {
    next("Please Provide Required Feild");
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return next("User Already Available!! Please Login");
  }

  const user = await userModel.create({
    name,
    lastName,
    email,
    password,
    mobileNumber: mobileNumber || null, // Set to null if not provided
    location: location || null, // Set to null if not provided
  });

  // Create Token
  const token = user.createJWT();
  res.status(200).send({
    message: "User Created Successfully",
    success: true,
    user: {
      name: user.name,
      lastname: user.lastName,
      email: user.email,
      mobileNumber: user.mobileNumber || null,
      location: user.location || null,
    },
    token,
  });
};

export const loginController = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next("Please Provide All Feild");
  }

  // Find USerAvailable or not
  const isAvai = await userModel.findOne({ email }).select("+password");

  if (!isAvai) {
    next("Invalid UserName or Password");
  }

  // comparePassword
  const isMatch = await isAvai.comparePassword(password);
  if (!isMatch) {
    next("Invalid UserName or Password");
  }
  isAvai.password = undefined;
  const token = isAvai.createJWT();
  res.status(200).send({
    message: "Login SuccessFully",
    success: true,
    isAvai: {
      name: isAvai.name,
      lastname: isAvai.lastName,
      email: isAvai.email,
      mobileNumber: isAvai.mobileNumber || null,
      location: isAvai.location || null,
    },
    token,
  });
};

