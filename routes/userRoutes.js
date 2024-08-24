import express from "express";
import { testPostController } from "../controllers/testControllerPost.js";
import userAuth from "../middelwares/authMiddleware.js";
import { updateUserController } from "../controllers/updateUserController.js";

const router = express.Router();

// get user
router.get("/userget/", userAuth, testPostController);

// update userInfo
router.put("/update/", userAuth, updateUserController);

export default router;
