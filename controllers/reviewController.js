import moment from "moment";
import userModel from "../models/userModel.js";
import reviewModel from "../models/reviewModel.js";
import mongoose from "mongoose";


 export const getAllReviewController = async (req, res, next) => {
    console.log(req.user.userId);
    let searchQueryResult = reviewModel.find({ userId: req.user.userId });
    const queryParams = req.query;
    // Initialize an empty sort object
    let sortObject = {};

    // Apply sort by time
    if (queryParams.sortbytime) {
      if (queryParams.sortbytime === 'latest') {
        sortObject['createdAt'] = -1;
      } else if (queryParams.sortbytime === 'oldest') {
        sortObject['createdAt'] = 1;
      }
    }
    
    // Apply sort by rating
    if (queryParams.sortbyrating) {
      if (queryParams.sortbyrating === 'highest') {
        sortObject['rating'] = -1;
      } else if (queryParams.sortbyrating === 'lowest') {
        sortObject['rating'] = 1;
      }
    }
    
    // Debugging: log the sortObject to ensure it is correct
    console.log("Sort object:", sortObject);
    
    // Apply sorting if there are criteria
    if (Object.keys(sortObject).length > 0) {
      searchQueryResult = searchQueryResult.sort(sortObject);
    } else {
      console.log("No sorting criteria provided.");
    }
    
    
    const pageNo = Number(req.query.page) || 1;
    const pageLimit =
      Number(req.query.limit) <= 15 ? Number(req.query.limit) : 10;

    const pageskip = (pageNo - 1) * pageLimit;
    const totalJobsAvailable = await reviewModel.countDocuments(
        searchQueryResult
    );
    searchQueryResult = searchQueryResult.skip(pageskip).limit(pageLimit);

    const currentPageJobCount = await reviewModel.countDocuments(
      searchQueryResult
    );
    const CurrentPageNo = Math.ceil(currentPageJobCount / pageLimit);
    const totalPages = Math.ceil(totalJobsAvailable / pageLimit);
    searchQueryResult = await searchQueryResult.exec();
    res.status(200).send({
        success: true,
        totalJobsAvailable,
        totalPages,
        currentPageJobCount,
        CurrentPageNo,
        searchQueryResult,
      });
  };    

  export const createReviewController = async (req, res, next) => {
    const { bookId, rating, comment } =req.body;
  
    if (!bookId || !rating) {
      next("Please Provide Required Feild");
    }
  
    req.body.userId = req.user.userId;
    const userId = req.user.userId;

    const isDataAvai = await reviewModel.findOne({userId:userId, bookId:bookId});
    console.log(isDataAvai);
    if (isDataAvai){
        return next("Book Review Already Available For this Book");
    }

    const createJob = await reviewModel.create({
        bookId, 
        rating, 
        comment,
        userId,
    });
    res.status(200).send({
      message: `Review Created SuccessFully For BookId ${bookId}`,
      success: true,
      createJob,
    });
  };
  
  
  export const updateReviewController = async (req, res, next) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next("Invalid ObjectId format Check ID");
    }
  
    const { rating, comment } =
      req.body;
  
    if (!rating) {
      next("Please Provide All Required Feild");
    }
  
    const existingUser = await reviewModel.findOne({ _id: id });
    if (!existingUser) {
      return next(`No Review Find With This ID ${id}`);
    }
  
    if (req.user.userId !== existingUser.userId.toString()) {
      next("You are not authorized to update this job");
      return;
    }

    // if (req.body.bookId !== existingUser.bookId.toString()){

    // }
  
    const updateJOb = await reviewModel.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).send({
      message: "Job Updated SuccessFully",
      success: true,
      updateJOb,
    });
  };
  
  export const deleteReviewController = async (req, res, next) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next("Invalid ObjectId format Check ID");
    }
  
    const existingUser = await reviewModel.findOne({ _id: id });
    if (!existingUser) {
      return next(`No Job ID Available With this id ${id} to Delete`);
    }
  
    if (req.user.userId !== existingUser.userId.toString()) {
      next("You are not authorized to Delete this Job");
      return;
    }
  
    const deleteJob = await reviewModel.deleteOne({ _id: id });
    res.status(200).send({
      message: "Job Deleted SuccessFully",
      success: true,
      deleteJob,
    });
  };
  
  // Jobs Stats and Filters by their Token
  export const singleReviewController = async (req, res, next) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next("Invalid ObjectId format Check ID");
    }
  
    const existingUser = await reviewModel.findOne({ _id: id });
    if (!existingUser) {
      return next(`No Review Available`);
    }
    res.status(200).send({
      message: "Single Selected Review ",
      success: true,
      existingUser,
    });
  };

  