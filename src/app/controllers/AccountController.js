

// GET /account/getUserAccount
const getUserAccount = async (req, res) => {
    console.log('>>>>>>>>> GETUSERACCOUNT')

    const data = {
        access_token: req.token,
        groupWithRoles: req.user.groupWithRoles,
        username: req.user.username
    }
    console.log('>>>>>>>>> data', data)
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

module.exports = {
    getUserAccount
}