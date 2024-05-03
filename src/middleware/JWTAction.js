require("dotenv").config();

const jwt = require("jsonwebtoken");

const nonSecurePaths = ["/account/login"];

const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key);
  } catch (error) {
    console.log(error);
  }

  return token;
};

const verifyToken = (token) => {
  let key = process.env.JWT_SECRET;
  let decoded = null;
  try {
    decoded = jwt.verify(token, key);
  } catch (error) {
    console.log(error);
  }

  return decoded;
};

const checkUserJWT = (req, res, next) => {
  if (nonSecurePaths.includes(req.originalUrl)) {
    return next();
  }
  let cookies = req.cookies;

  if (cookies && cookies.jwt) {
    let token = cookies.jwt;
    let decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      // có cookies, nhưng không có jwt
      return res.status(401).json({
        errcode: -1,
        message: "Not authenticated",
        data: "",
      });
    }
  } else {
    // không có cookies
    return res.status(401).json({
      errcode: -1,
      message: "Not authenticated",
      data: "",
    });
  }
};

const checkUserPermission = (req, res, next) => {
  if (nonSecurePaths.includes(req.originalUrl)) {
    return next();
  }

  if (req.user) {
    let username = req.user.username;
    let roles = req.user.groupWithRoles;
    let currentUrl = req.originalUrl;

    console.log(">>> currentUrl", currentUrl);

    if (!roles || roles.length === 0) {
      return res.status(403).json({
        errcode: -1,
        message: `You don't have permission to access this resource.`,
        data: "",
      });
    }

    let canAccess = roles.some((item) => item.URL === currentUrl);
    if (canAccess === true) {
      next();
    } else {
      return res.status(403).json({
        errcode: -1,
        message: `You don't have permission to access this resource.`,
        data: "",
      });
    }
  } else {
    return res.status(401).json({
      errcode: -1,
      message: "Not authenticated",
      data: "",
    });
  }
};

module.exports = {
  createJWT,
  verifyToken,
  checkUserJWT,
  checkUserPermission,
};
