import express from "express";
import userAuth from "../middelwares/authMiddleware.js";
import { searchStatusJobController } from "../controllers/searchJobFilter.js";

const router = express.Router();

// Person's status wise Aggrigation
router.get("/job?", userAuth, searchStatusJobController);

export default router;
