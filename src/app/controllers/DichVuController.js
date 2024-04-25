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

        return { madv, maldv, tendv, giadv };
      });
      console.log(dichvus);
      setTimeout(
        () =>
          res.send({
            errcode: 0,
            message: "Successful",
            data: formattedDichvus,
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
