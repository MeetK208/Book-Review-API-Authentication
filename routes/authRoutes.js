import express from "express";
import {
  loginController,
  registerController,
} from "../controllers/authController.js";

const router = express.Router();

// routes register Post
router.post("/register/", registerController);

// routes Login post
router.post("/login/", loginController);

// export
export default router;
