
const { Int } = require("msnodesqlv8");
const db = require("../../config/db");
const oracledb = require("oracledb");

class DichVuController {
  // GET /dichvu/getAll

  async getAll(req, res) {
    try {
      const sqlQuery = "SELECT * FROM DICHVU";
      const dichvus = await db.executeQuery(sqlQuery);

      setTimeout(
        () =>
          res.status(200).json({
            errcode: 0,
            message: "Successful",
            data: dichvus,
          }),
        1000
      );
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

module.exports = new DichVuController();
