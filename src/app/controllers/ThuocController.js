const db = require("../../config/db");
const oracledb = require("oracledb");
const { format } = require("date-fns");

class ThuocController {
  // GET /getAll/
  async fetchAllThuoc(req, res) {
    try {
      const sqlQuery = `
      SELECT DISTINCT th.MATHUOC, TENTHUOC, THANHPHAN, TENDONVI, GIABAN, SUM(SOLUONGTON) AS SOLUONGTON
      FROM THUOC th, DONVITHUOC dvt, LOTHUOC loth
      WHERE th.MADVT = dvt.MADVT
      AND th.MATHUOC = loth.MATHUOC
      AND loth.HANSD > (SELECT TRUNC(CURRENT_DATE) AS current_date
                        FROM dual)
      GROUP BY th.MATHUOC, TENTHUOC, THANHPHAN, TENDONVI, GIABAN`;

      const thuocList = await db.executeQuery(sqlQuery);

      res.status(200).send({
        errcode: 0,
        message: "Successful",
        data: thuocList,
      });
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({
        errcode: -1,
        message: "Internal Server Error",
      });
    }
  }
}

module.exports = new ThuocController();
