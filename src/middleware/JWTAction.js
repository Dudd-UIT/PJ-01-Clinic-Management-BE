require("dotenv").config();

const jwt = require("jsonwebtoken");

const nonSecurePaths = ["/account/login", "/account/logout"];

const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
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

const extractToken = (req) => {
  if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
}

const checkUserJWT = (req, res, next) => {
  if (nonSecurePaths.includes(req.originalUrl)) {
    console.log("KHONG CHECK JWT:", req.originalUrl)
    return next();
  }

  let cookies = req.cookies;
  let tokenFromHeader = extractToken(req);

  if ((cookies && cookies.jwt) || tokenFromHeader ) {
    let token = (cookies && cookies.jwt) ? cookies.jwt : tokenFromHeader;

    let decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
      req.token = token;
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
  if (nonSecurePaths.includes(req.originalUrl) || req.originalUrl === '/account/getUserAccount') { 
    console.log("KHONG CHECK PERMISSION:", req.originalUrl)
    return next();
  }

  if (req.user) {
    let username = req.user.username;
    let roles = req.user.groupWithRoles;
    let currentUrl = req.originalUrl;

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
