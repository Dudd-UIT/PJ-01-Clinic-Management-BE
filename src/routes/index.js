const siteRouter = require('./site')
const patientRouter = require('./patient')
const doctorRouter = require('./doctor')
const dichvuRouter = require('./dichvu')
const phieukhamRouter = require('./phieukham')
const donthuocRouter = require('./donthuoc')
const hoadonRouter = require('./hoadon')

function route(app) {
    app.use('/', siteRouter)

    app.use('/benhnhan', patientRouter)

    app.use('/bacsi', doctorRouter)

    app.use('/dichvu', dichvuRouter)

    app.use('/phieukham', phieukhamRouter)

    app.use('/donthuoc', donthuocRouter)

    app.use('/hoadon', hoadonRouter)

}

module.exports = route