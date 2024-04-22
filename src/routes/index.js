const siteRouter = require('./site')
const patientRouter = require('./patient')
const doctorRouter = require('./doctor')
const serviceRouter = require('./service')

function route(app) {
    app.use('/', siteRouter)

    app.use('/patient', patientRouter)

    app.use('/doctor', doctorRouter)

    app.use('/service', serviceRouter)

}

module.exports = route