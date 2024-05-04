const db = require("../config/db");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const { getGroupWithRoles, getUserInfo } = require("./JWTService");
const { createJWT } = require("../middleware/JWTAction");

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  return hashPassword;
};

const checkPassword = (inputPassword, hashPassword) => {
  return bcrypt.compareSync(inputPassword, hashPassword);
};

const handleUserLogin = async (rawData) => {
  let username = rawData.username;
  let password = rawData.password;
  try {
    const sqlQuery = `SELECT * FROM TAIKHOAN WHERE USERNAME = '${username}'`;
    let user = await db.executeQuery(sqlQuery);

    if (user.length > 0) {
      let isCorrectPassword = checkPassword(password, user[0].PASSWORD);
      if (isCorrectPassword === true) {
        let groupWithRoles = await getGroupWithRoles(user);
        const groupName = groupWithRoles[0].TENNHOM;

        let userInfo = null;
        if (groupName !== "Admin") {
          userInfo = await getUserInfo(user);
          console.log(">>>> userInfo", userInfo);
        }

        let payload = {
          username: user[0].USERNAME,
          groupWithRoles,
        };
        let token = createJWT(payload);

        return {
          errcode: 0,
          message: "OK",
          data: {
            access_token: token,
            groupWithRoles,
            username: user[0].USERNAME,
            groupName: groupName,
            userInfo,
          },
        };
      }
    }
    return {
      errcode: 1,
      message: "Your username or password is incorrect!",
      data: "",
    };
  } catch (error) {
    console.log(error);
    return {
      errcode: -1,
      message: "Somthing went wrong",
      data: "",
    };
  }
};

module.exports = {
  handleUserLogin,
};
