const db = require("../config/db");
const bcrypt = require("bcryptjs");

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
      console.log(">>>>> Found user with username", username);
      let isCorrectPassword = checkPassword(password, user[0].PASSWORD);
      if (isCorrectPassword === true) {
        console.log(
          ">>>>> Login user with username:",
          username,
          "password:",
          password
        );
        return {
          errcode: 0,
          message: "OK",
          data: "",
        };
      }
    }
    console.log(">>>> No user with username:", username, "password:", password);
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
