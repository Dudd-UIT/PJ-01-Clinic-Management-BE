const db = require("../config/db");
const bcrypt = require("bcryptjs");
const oracledb = require("oracledb");

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
  let username = rawData.username ? rawData.username : rawData.phoneNumber;
  let password = rawData.password;

  try {
    const sqlQuery = `SELECT * FROM TAIKHOAN WHERE USERNAME = '${username}' AND TRANGTHAI = 1`;
    let user = await db.executeQuery(sqlQuery);

    if (user.length > 0) {
      let isCorrectPassword = checkPassword(password, user[0].PASSWORD);
      if (isCorrectPassword === true) {
        let groupWithRoles = await getGroupWithRoles(user);
        const roles = groupWithRoles.map((item) => {
          let data = { MAVAITRO: +item.MAVAITRO, URL: item.URL };
          return data;
        });
        console.log('roles', roles)

        const groupID = user[0].MANHOM;
        console.log('groupID', groupID)

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
          message: "Đăng nhập thành công!!!",
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

const handleRegister = async (rawData) => {
  const phoneNumber = rawData.phoneNumber;
  const password = rawData.password;

  try {
    const sqlQuery = `SELECT * FROM TAIKHOAN WHERE USERNAME = '${phoneNumber}' AND TRANGTHAI = 1`;
    let user = await db.executeQuery(sqlQuery);

    if (user.length > 0) {
      return {
        errcode: 1,
        message: "Tài khoản đã được đăng kí.",
        data: "",
      };
    } else {
      const hashPass = hashUserPassword(password);
      const sqlQuery = ` 
                    BEGIN
                      INSERT_TAIKHOAN(:PAR_MANHOM, :PAR_USERNAME, :PAR_PASSWORD, :MATK_OUT);
                    END;`;
      const bindVars = {
        PAR_MANHOM: 4,
        PAR_USERNAME: phoneNumber,
        PAR_PASSWORD: hashPass,
        MATK_OUT: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);
      const maTK = result.outBinds.MATK_OUT;

      console.log('result', result);
      console.log('maTK', maTK);

      return {
        errcode: 0,
        message: `Đăng ký tài khoản thành công, mã tài khoản là ${maTK}`,
        data: "",
      };
    }

    return {
      errcode: 1,
      message: "Your username or old password is incorrect!",
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

const handleChangePassword = async (rawData) => {
  let username = rawData.username;
  let oldPassword = rawData.oldPassword;
  let newPassword = rawData.newPassword;

  try {
    const sqlQuery = `SELECT * FROM TAIKHOAN WHERE USERNAME = '${username}' AND TRANGTHAI = 1`;
    let user = await db.executeQuery(sqlQuery);

    if (user.length > 0) {
      let isCorrectPassword = checkPassword(oldPassword, user[0].PASSWORD);
      if (isCorrectPassword === true) {
        const hashPass = hashUserPassword(newPassword);
        const maTK = user[0].MATK;
        const sqlQuery = ` 
                          BEGIN
                              UPDATE_TAIKHOAN(:PAR_MATK, :PAR_USERNAME, :PAR_PASSWORD);
                          END;`;
        const bindVars = {
          PAR_MATK: maTK,
          PAR_USERNAME: username,
          PAR_PASSWORD: hashPass,
        };

        const result = await db.executeProcedure(sqlQuery, bindVars);

        return {
          errcode: 0,
          message: "Đổi mật khẩu thành công",
          data: "",
        };
      }
    }
    return {
      errcode: 1,
      message: "Your username or old password is incorrect!",
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
  handleRegister,
  handleChangePassword,
};
