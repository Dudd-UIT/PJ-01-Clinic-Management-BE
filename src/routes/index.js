const siteRouter = require('./site')
const customerRouter = require('./customer')
const doctorRouter = require('./doctor')

function route(app) {
    app.use('/', siteRouter)

    app.use('/customer', customerRouter)
    
    app.use('/doctor', doctorRouter)

}

module.exports = route