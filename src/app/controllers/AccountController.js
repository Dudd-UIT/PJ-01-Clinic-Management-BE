const { handleUserLogin } = require('../../services/UserService');

// GET /account/getUserAccount
const getUserAccount = async (req, res) => {
    const data = {
        access_token: req.token,
        groupWithRoles: req.user.groupWithRoles,
        username: req.user.username
    }
    return res.status(200).json({
        errcode: 0,
        message: 'Get user accout successfully.',
        data: {
            access_token: req.token,
            groupWithRoles: req.user.groupWithRoles,
            username: req.user.username
        }
    })
}

// GET /account/getUserInfo
const getUserInfo = async (req, res) => {
    try {
        const sqlQuery = "SELECT * FROM BACSI";
        const doctors = await db.executeQuery(sqlQuery);
  
        const formattedDoctors = doctors.map((doctor) => {
          doctor.NGAYSINH = new Date(doctor.NGAYSINH);
          return doctor;
        });
  
        res.status(200).json({
          errcode: 0,
          message: "Successful",
          data: formattedDoctors,
        });
      } catch (error) {
        console.error("Error querying database:", error);
        res.status(500).json({ 
          errcode: -1,
          message: "Error from server",
          data: [],
         });
      }
}

// POST /account/login
const login = async (req, res) => {
    try {
        let Data = await handleUserLogin(req.body)
        console.log('>>>> DATA', Data)

        if(Data && Data.data && Data.data.access_token) {
            res.cookie('jwt', Data.data.access_token, { httpOnly: true, maxAge: process.env.JWT_EXPIRES_IN})
        }

        return res.status(200).json({
            errcode: Data.errcode,
            message: Data.message,
            data: Data.data
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errcode: '-1',
            message: 'error from server',
            data: []
        })
    }
}

// POST /account/logout
const logout = async (req, res) => {
    try {
        res.clearCookie('jwt')
        return res.status(200).json({
            errcode: 0,
            message: 'clear cookies done!',
            data: ''
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errcode: -1,
            message: 'error from server',
            data: []
        })
    }
}

module.exports = {
    getUserAccount,
    getUserInfo,
    login,
    logout
}