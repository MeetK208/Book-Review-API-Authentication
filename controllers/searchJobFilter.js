import moment from "moment";
import jobsModel from "../models/reviewModel.js";
import mongoose from "mongoose";

export const searchStatusJobController = async (req, res, next) => {
  const queryParams = req.query;
  console.log("Query Params:", queryParams);

  const queryObject = {
    createdBy: req.user.userId,
  };

  // Filter by status
  if (queryParams.status && queryParams.status !== "all") {
    queryObject.status = queryParams.status;
  }

  // Filter by workType
  if (queryParams.workType && queryParams.workType !== "all") {
    queryObject.workType = queryParams.workType;
  }

  // Filter by workLocation
  if (queryParams.workLocation && queryParams.workLocation !== "all") {
    queryObject.workLocation = queryParams.workLocation;
  }
  // Search based on Timerange
  if (queryParams.startdate && queryParams.enddate) {
    const startOfDay = moment(queryParams.startdate).toDate();
    const endOfDay = moment(queryParams.enddate).toDate();

    console.log("Date Range:", { startOfDay, endOfDay });
    queryObject.createdAt = {
      $gte: startOfDay,
      $lt: endOfDay,
    };
  } else if (queryParams.startdate && !queryParams.enddate) {
    const startOfDay = moment(queryParams.startdate).toDate();

    queryObject.createdAt = {
      $gte: startOfDay,
    };
  } else if (queryParams.enddate && !queryParams.startdate) {
    const endOfDay = moment(queryParams.enddate).toDate();

    queryObject.createdAt = {
      $lt: endOfDay,
    };
  }

  //   search job based on position
  if (queryParams.search) {
    const searchTerms = queryParams.search.split(",");

    if (searchTerms.length === 1) {
      // Handle single search term using regex
      queryObject.position = { $regex: searchTerms[0], $options: "i" };
    } else {
      // Handle multiple search terms
      queryObject.position = {
        $in: searchTerms.map((term) => new RegExp(term, "i")),
      };
    }
  }

  console.log("Query Object:", queryObject);

  try {
    let searchQueryResult = jobsModel.find(queryObject);

    if (queryParams.sort) {
      if (queryParams.sort === "latest") {
        searchQueryResult = searchQueryResult.sort({ createdAt: -1 });
      } else if (queryParams.sort === "oldest") {
        searchQueryResult = searchQueryResult.sort({ createdAt: 1 });
      } else if (queryParams.sort === "a-z") {
        searchQueryResult = searchQueryResult.sort({ position: 1 });
      } else if (queryParams.sort === "z-a") {
        searchQueryResult = searchQueryResult.sort({ position: -1 });
      }
    }

    const pageNo = Number(req.query.page) || 1;
    const pageLimit =
      Number(req.query.limit) <= 50 ? Number(req.query.limit) : 50;

    const pageskip = (pageNo - 1) * pageLimit;
    const totalJobsAvailable = await jobsModel.countDocuments(
      searchQueryResult
    );
    searchQueryResult = searchQueryResult.skip(pageskip).limit(pageLimit);

    const currentPageJobCount = await jobsModel.countDocuments(
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
  } catch (error) {
    console.error("Error executing query:", error);
    next(error);
  }
};
