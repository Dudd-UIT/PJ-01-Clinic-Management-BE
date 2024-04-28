const { handleUserLogin } = require('../../services/UserService');


// POST /login/
const index = async (req, res) => {
    try {
        let data = await handleUserLogin(req.body)
        return res.status(200).json({
            errcode: data.errcode,
            message: data.message,
            data: data.data
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errcode: '-1',
            message: 'error from server',
            data: ''
        })
    }
}

module.exports = {
    index
}