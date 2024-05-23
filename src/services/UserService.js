const db = require("../config/db");
const bcrypt = require("bcryptjs");
const oracledb = require("oracledb");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();
const moment = require("moment");

const { getGroupWithRoles, getUserInfo } = require("./JWTService");
const { createJWT } = require("../middleware/JWTAction");

const salt = bcrypt.genSaltSync(10);
let otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "danhdudoan999@gmail.com",
    pass: "kjcjxbkayvaadpcr",
  },
});

const hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  return hashPassword;
};

const checkPassword = (inputPassword, hashPassword) => {
  return bcrypt.compareSync(inputPassword, hashPassword);
};

const handleVerify = async (email) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const expirationTime = Date.now() + 60000;
  otpStore[email] = { otp, expirationTime };
  console.log("otpStore", otpStore);
  const mailOptions = {
    from: "danhdudoan999@gmail.com",
    to: email,
    subject: "Xác thực tài khoản BCareFull",
    text: `Mã xác thực của bạn là ${otp}. Mã này sẽ hết hạn sau 60 giây.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      errcode: 0,
      message: "OTP sent successfully",
      data: "",
    };
  } catch (error) {
    console.error(error);
    return {
      errcode: 1,
      message: "Failed to send OTP",
      data: "",
    };
  }
};

const handleConfirmUser = async (rawData) => {
  const email = rawData.email;
  const otp = rawData.otp;

  const currentTime = Date.now();
  console.log(email, otp);
  console.log(otpStore[email]);

  if (otpStore[email] && currentTime > otpStore[email].expirationTime) {
    delete otpStore[email];
    return {
      errcode: 1,
      message: "OTP hết hạn",
      data: "",
    };
  }

  if (otpStore[email] && otpStore[email].otp === otp) {
    delete otpStore[email];
    return {
      errcode: 0,
      message: "Xác thực thành công.",
      data: "",
    };
  } else {
    return {
      errcode: -1,
      message: "Mã OTP không chính xác.",
      data: "",
    };
  }
};

const handleUserLogin = async (rawData) => {
  let username = rawData.username ? rawData.username : rawData.email;
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
        console.log("roles", roles);

        const groupID = user[0].MANHOM;
        console.log("groupID", groupID);

        const sql = `SELECT TENNHOM FROM NHOM WHERE MANHOM = '${groupID}'`;
        let result = await db.executeQuery(sql);
        const groupName = result[0].TENNHOM;
        console.log("groupName", groupName);

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

// them benh nhan chua co tai khoan va ho so benh nhan
const handleRegisterTK_BN = async (rawData) => {
  const {
    email,
    password,
    hoTen,
    cccd,
    gioiTinh,
    ngaySinh,
    soDienThoai,
    diaChi,
    tienSuBenh,
    diUng,
  } = rawData;

  const parts = ngaySinh.split("/");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const formattedNgaySinh = new Date();
  formattedNgaySinh.setFullYear(year, month, day);

  console.log("formattedNgaySinh", formattedNgaySinh);

  try {
    const sqlQuery = `SELECT * FROM TAIKHOAN WHERE USERNAME = '${email}' AND TRANGTHAI = 1`;
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
            INSERT_TAIKHOAN_BENHNHAN (:PAR_USERNAME, :PAR_PASSWORD, :PAR_CCCD, :PAR_HOTEN, :PAR_NGAYSINH, :PAR_GIOITINH, :PAR_SDT, :PAR_DIACHI, :PAR_TIENSUBENH, :PAR_DIUNG, :PAR_EMAIL, :MABN_OUT); 
          END;`;
      const bindVars = {
        PAR_USERNAME: email,
        PAR_PASSWORD: hashPass,
        PAR_CCCD: cccd,
        PAR_HOTEN: hoTen,
        PAR_NGAYSINH: formattedNgaySinh,
        PAR_GIOITINH: gioiTinh,
        PAR_SDT: soDienThoai,
        PAR_DIACHI: diaChi,
        PAR_TIENSUBENH: tienSuBenh,
        PAR_DIUNG: diUng,
        PAR_EMAIL: email,
        MABN_OUT: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);
      const maBN = result.outBinds.MABN_OUT;

      return {
        errcode: 0,
        message: `Đăng ký tài khoản thành công, mã bệnh nhân của quý khách là ${maBN}`,
        data: "",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      errcode: -1,
      message: "Somthing went wrong",
      data: "",
    };
  }
};

// them benh nhan da co ho so nhưng cho co tai khoan
const handleRegisterTK = async (rawData) => {
  const { email, password, maBN } = rawData;

  try {
    const sqlQuery = `SELECT * FROM TAIKHOAN WHERE USERNAME = '${email}' AND TRANGTHAI = 1`;
    let user = await db.executeQuery(sqlQuery);

    if (user.length > 0) {
      return {
        errcode: 1,
        message: "Email này đã được đăng kí tài khoản khác.",
        data: "",
      };
    } else {
      const hashPass = hashUserPassword(password);
      const sqlQuery = `
          BEGIN
            INSERT_TAIKHOAN_UPDATE_BENHNHAN (:PAR_USERNAME, :PAR_PASSWORD, :PAR_MABN, :MABN_OUT);
          END;`;
      const bindVars = {
        PAR_USERNAME: email,
        PAR_PASSWORD: hashPass,
        PAR_MABN: maBN,
        MABN_OUT: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);
      // const maTK = result.outBinds.MABN_OUT;

      return {
        errcode: 0,
        message: `Đăng ký tài khoản thành công, mã bệnh nhân của quý khách là ${maBN}`,
        data: "",
      };
    }
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
  handleVerify,
  handleConfirmUser,
  handleUserLogin,
  handleRegisterTK_BN,
  handleRegisterTK,
  handleChangePassword,
};
