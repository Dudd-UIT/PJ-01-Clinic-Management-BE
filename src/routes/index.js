const siteRouter = require('./site')
const patientRouter = require('./patient')
const doctorRouter = require('./doctor')
const dichvuRouter = require('./dichvu')
const phieukhamRouter = require('./phieukham')

function route(app) {
    app.use('/', siteRouter)

    app.use('/patient', patientRouter)

    app.use('/doctor', doctorRouter)

    app.use('/service', dichvuRouter)

    app.use('/phieukham', phieukhamRouter)

}

module.exports = route