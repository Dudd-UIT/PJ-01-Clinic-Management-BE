const db = require("../../config/db");
const oracledb = require("oracledb");

class DoctorController {
  // GET /bacsi/getAll
  async getAll(req, res) {
    try {
      const sqlQuery = "SELECT * FROM BACSI";
      const doctors = await db.executeQuery(sqlQuery);

      const formattedDoctors = doctors.map((doctor) => {
        doctor.NGAYSINH = new Date(doctor.NGAYSINH);
        const INFOBSTH = "BS " + doctor.TRINHDO + " " + doctor.HOTEN;
        return {...doctor, INFOBSTH};
      });

      res.status(200).json({
        errcode: 0,
        message: "Successful",
        data: formattedDoctors,
      });
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ 
        errcode: -1,
        message: "Error from server",
        data: [],
       });
    }
  }
}

module.exports = new DoctorController();
