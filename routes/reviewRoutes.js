import express from "express";
import {
  getAllReviewController, createReviewController, updateReviewController, deleteReviewController, singleReviewController, 
} from "../controllers/reviewController.js";
import userAuth from "../middelwares/authMiddleware.js";

const router = express.Router();

// routes register Post
router.get("/getall/?" , userAuth, getAllReviewController);
router.get("/get/:id/" , userAuth, singleReviewController);
router.post("/add-review/" , userAuth, createReviewController);
router.put("/update-review/:id" , userAuth, updateReviewController);
router.delete("/delete/:id" , userAuth, deleteReviewController);

// export
export default router;
