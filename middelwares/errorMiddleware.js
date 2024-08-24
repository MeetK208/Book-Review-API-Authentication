// // Error Middelware || Next Function

// const errorMiddelware = (err, req, res, next) => {
//     console.log(err);
//     res.status(500).send({
//         success: false,
//         message: "Something Went Wrong Please Check",
//         err,
//     });
// };

// export default errorMiddelware;

// Error Middelware || Next Function

const errorMiddelware = (err, req, res, next) => {
  console.log(err);
  const defaultErrors = {
    statusCode: 500,
    message: err,
  };

  if (err.name === "ValidationError") {
    defaultErrors.statusCode = 400;
    defaultErrors.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
  }
  if (err.code && err.code === 11000) {
    defaultErrors.statusCode = 400;
    defaultErrors.message = `${Object.keys(
      err.keyValue
    )} feild has to be unique`;
  }
  res.status(defaultErrors.statusCode).json({
    message: defaultErrors.message,
  });
};

export default errorMiddelware;
