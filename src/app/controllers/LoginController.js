const { handleUserLogin } = require('../../services/UserService');


// POST /login/login
const login = async (req, res) => {
    try {
        let Data = await handleUserLogin(req.body)

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

module.exports = {
    login
}