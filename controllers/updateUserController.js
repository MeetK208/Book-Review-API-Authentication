import userModel from "../models/userModel.js";

export const updateUserController = async (req, res, next) => {
  const {
    name,
    lastName,
    middleName,
    email,
    password,
    mobileNumber,
    location,
  } = req.body;

  if (!name || !lastName || !email || !mobileNumber) {
    next("Please Provide Required Feild");
  }

  const existingUser = await userModel.findOne({ _id: req.user.userId });
  if (!existingUser) {
    return next("User Not Available");
  }

  (existingUser.name = name),
    (existingUser.lastName = lastName),
    (existingUser.middleName = middleName || existingUser.middleName),
    (existingUser.email = email),
    (existingUser.mobileNumber = mobileNumber),
    (existingUser.location = location || existingUser.location);

  await existingUser.save();
  const token = existingUser.createJWT();
  res.status(200).send({
    message: "Update SuccessFully",
    success: true,
    existingUser: {
      name: existingUser.name,
      lastname: existingUser.lastName,
      email: existingUser.email,
      mobileNumber: existingUser.mobileNumber || null,
      location: existingUser.location || null,
    },
    token,
  });
};
