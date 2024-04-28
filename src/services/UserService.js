const db =  require("../config/db");
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);


const hashUserPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword;
}

const checkPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword);
}

const handleUserLogin = async(rawData) => {
    let username = rawData.username
    let password = rawData.password
    let hashPass = hashUserPassword(rawData.password);
    try {
        const sqlQuery = `SELECT * FROM TAIKHOAN WHERE USERNAME = '${username}' AND PASSWORD = '${password}'`;
        let user = await db.executeQuery(sqlQuery);
        console.log(user)
        if(user.length > 0){
            // console.log('>> found user with username');
            // let isCorrectPassword = checkPassword(password, hashPass);
            // if(isCorrectPassword === true) {
            //     return {
            //         errcode: 0,
            //         message: "OK",
            //         data: '',
            //     }
            // }
            console.log(">>Input user with username:", username, "password:", password);

            return {
                errcode: 0,
                message: "OK",
                data: '',
            }
            // return {
            //     errcode: 1,
            //     message: "Your username or password is incorrect!",
            //     data: '',
            // }
        }
        console.log(">>No user with username:", username, "password:", password);
        return {
            errcode: 1,
            message: "Your username or password is incorrect!",
            data: '',
        }
    } catch (error) {
        console.log(error);
        return {
            errcode: -1,
            message: "Somthing went wrong",
            data: '',
        }
    }
};

module.exports = {
    handleUserLogin
}