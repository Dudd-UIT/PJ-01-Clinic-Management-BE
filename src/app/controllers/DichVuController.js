const { Int } = require("msnodesqlv8");
const db = require("../../config/db");
const oracledb = require("oracledb");

class DichVuController {
  // GET /service/

  async index(req, res) {
    try {
      const sqlQuery = "SELECT * FROM DICHVU";
      const dichvus = await db.executeQuery(sqlQuery);

      setTimeout(
        () =>
          res.send({
            errcode: 0,
            message: "Successful",
            data: dichvus,
          }),
        1000
      );
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new DichVuController();
