const { Int } = require("msnodesqlv8");
const db = require("../../config/db");
const oracledb = require("oracledb");

class DichVuController {
  // GET /service/

  async index(req, res) {
    try {
      const sqlQuery = "SELECT * FROM DICHVU";
      const dichvus = await db.executeQuery(sqlQuery);

      const formattedDichvus = dichvus.map((dichvu) => {
        const [madv, maldv, tendv, giadv] = dichvu;

        const formattedGiaDV = Int(giadv);

        return [madv, maldv, tendv, formattedGiaDV];
      });
      console.log(dichvus);
      setTimeout(() => res.send(dichvus), 1000);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new DichVuController();
