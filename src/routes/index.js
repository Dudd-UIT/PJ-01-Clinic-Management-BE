const siteRouter = require('./site')
const patientRouter = require('./patient')
const doctorRouter = require('./doctor')
const dichvuRouter = require('./dichvu')
const phieukhamRouter = require('./phieukham')
const donthuocRouter = require('./donthuoc')
const loginRouter = require('./login')

function route(app) {
    app.use('/', siteRouter)

    app.use('/login', loginRouter)

    app.use('/benhnhan', patientRouter)

    app.use('/bacsi', doctorRouter)

    app.use('/dichvu', dichvuRouter)

    app.use('/phieukham', phieukhamRouter)

    app.use('/donthuoc', donthuocRouter)

}

module.exports = route