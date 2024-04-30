const siteRouter = require('./site')
const patientRouter = require('./patient')
const doctorRouter = require('./doctor')
const dichvuRouter = require('./dichvu')
const phieukhamRouter = require('./phieukham')
const donthuocRouter = require('./donthuoc')
const loginRouter = require('./login')
const hoadonRouter = require('./hoadon')
const { checkUserJWT, checkUserPermission } = require('../middleware/JWTAction')
const express = require("express");
const router = express.Router();


function route(app) {
    app.use('*', checkUserJWT, checkUserPermission)

    app.use('/', siteRouter)

    app.use('/account', loginRouter)

    app.use('/benhnhan', patientRouter)

    app.use('/bacsi', doctorRouter)

    app.use('/dichvu', dichvuRouter)

    app.use('/phieukham', phieukhamRouter)

    app.use('/donthuoc', donthuocRouter)

    app.use('/hoadon', hoadonRouter)

}

module.exports = route