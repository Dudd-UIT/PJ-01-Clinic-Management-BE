const db = require("../../config/db");
const oracledb = require("oracledb");
const { format } = require("date-fns");

class DonThuocController {
  // GET /ds-thuoc/:id
  async fetchDSThuoc(req, res) {
    try {
      const sqlQuery = `
      SELECT th.MATHUOC, TENTHUOC, THANHPHAN, TENDONVI, SOLUONGTHUOC, GIABAN, SOLANUONG, SOLUONGUONG, GHICHU, hd.MAHD, TTTT
      FROM DONTHUOC dth, CTDT, THUOC th, LOTHUOC loth, DONVITHUOC dvth, HOADON hd
      WHERE dth.MADT = ctdt.MADT
      AND ctdt.MATHUOC = th.MATHUOC
      AND th.MATHUOC = loth.MATHUOC
      AND th.MADVT = dvth.MADVT
      AND dth.MAHD = hd.MAHD
      AND dth.MAPK = ${req.params.id}`;

      const thuocList = await db.executeQuery(sqlQuery);

      // coi lại khúc ni
      if (thuocList.length === 0) {
        res.status(200).json({
          errcode: 1,
          message: "No data found: don thuoc chua co data or Invalid MAPK",
          data: thuocList,
        });
        return;
      }

      setTimeout(
        () =>
          res.send({
            errcode: 0,
            message: "Successful",
            data: thuocList,
          }),
        1000
      );
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ 
        errcode: 2,
        message: "Internal Server Error",
      });
    }
  }
}

module.exports = new DonThuocController();
