const { Int } = require("msnodesqlv8");
const db = require("../../config/db");
const oracledb = require("oracledb");

class ServiceController {
  // GET /service/

  async index(req, res) {
    try {
      const sqlQuery = "SELECT * FROM DICHVU";
      const services = await db.executeQuery(sqlQuery);

      const formattedServices = services.map((service) => {
        const [madv, maldv, tendv, giadv] = service;

        const formattedGiaDV = Int(giadv);

        return [madv, maldv, tendv, formattedGiaDV];
      });
      setTimeout(() => res.send(services), 1000);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new ServiceController();
