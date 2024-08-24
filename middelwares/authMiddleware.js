import JWT from "jsonwebtoken";
console.log("hear");
const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    next("Auth failed !!");
    return;
  }

  const getToken = authHeader.split(" ")[1];
  try {
    const payload = JWT.verify(getToken, process.env.JWT_SECRET);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    next("Auth Failed !!");
  }
};

export default userAuth;
