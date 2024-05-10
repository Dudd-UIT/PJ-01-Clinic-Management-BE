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
    const sqlQuery = `SELECT * FROM TAIKHOAN WHERE USERNAME = '${username}' AND TRANGTHAI = 1`;
    let user = await db.executeQuery(sqlQuery);

    if (user.length > 0) {
      let isCorrectPassword = checkPassword(password, user[0].PASSWORD);
      if (isCorrectPassword === true) {
        let groupWithRoles = await getGroupWithRoles(user);
        const roles = groupWithRoles.map(item => {
          let data = {MAVAITRO: +item.MAVAITRO, URL: item.URL};
          return data;
        })
        const groupID = user[0].MANHOM;
        console.log('groupID', groupID)

        console.log('groupWithRoles', groupWithRoles)
        const sql = `SELECT TENNHOM FROM NHOM WHERE MANHOM = '${groupID}'`;
        let result = await db.executeQuery(sql);
        const groupName = result[0].TENNHOM;
        console.log('groupName', groupName)

        let userInfo = null;
        if (groupName !== "Admin") {
          userInfo = await getUserInfo(user);
        }

        let payload = {
          roles,
          username: user[0].USERNAME,
          groupName,
          groupID,
          userInfo,
        };
        let token = createJWT(payload);
        return {
          errcode: 0,
          message: "OK",
          data: {
            access_token: token,
            roles,
            username: user[0].USERNAME,
            groupName,
            groupID,
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
  hashUserPassword,
  handleUserLogin,
};
