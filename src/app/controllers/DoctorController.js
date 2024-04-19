const db = require("../../config/db");
const oracledb = require("oracledb");

class DoctorController {

    // GET /customer/
    index(req, res) {
        res.send('DOCTOR')
    }
}

module.exports = new DoctorController();
