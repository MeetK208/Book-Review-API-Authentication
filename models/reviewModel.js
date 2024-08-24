import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const ReviewSchema = new mongoose.Schema(
  {
    bookId: {
      type: String,
      required: [true, "bookId is Required"],
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      min: 0, 
      max: 5,
      required: [true, "rating is Required"],
    },
    comment: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", ReviewSchema);
