const db = require("../../config/db");
const oracledb = require("oracledb");
const { format } = require("date-fns");

class ClsController {
  // GET /ds-cls/getById/:id
  async fetchClsById(req, res) {
    try {
      const sqlQuery = `SELECT cls.MAKQ, dv.TENDV, dv.GIADV, cls.TRANGTHAITH, hd.TTTT
      FROM PHIEUKHAM pk, KETQUADICHVUCLS cls, DICHVU dv, HOADON hd
      WHERE pk.MAPK = cls.MAPK
      AND cls.MADVCLS = dv.MADV
      AND hd.MAHD = cls.MAHD
      AND pk.MAPK = ${req.params.id}`;

      const clsList = await db.executeQuery(sqlQuery);

      // coi lại khúc ni
      if (clsList.length === 0) {
        res.status(200).json({
          errcode: 1,
          message: "No data found: don thuoc chua co data or Invalid MAPK",
          data: clsList,
        });
        return;
      }

      setTimeout(
        () =>
          res.status(200).send({
            errcode: 0,
            message: "Successful",
            data: clsList,
          }),
        1000
      );
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ 
        errcode: -1,
        message: "Lỗi ở server",
      });
    }
  }

  // GET /getAll
  async fetchAllCls(req, res) {
    try {
      const sqlQuery = `SELECT cls.MAKQ, pk.MAPK, pk.NGAYKHAM, cls.STT, bn.HOTEN AS TENBN, bn.NGAYSINH, bn.GIOITINH, bn.SDT, bs.HOTEN as TENBSTH, bs.TRINHDO, dv.TENDV, cls.TRANGTHAITH, hd.TTTT
      FROM PHIEUKHAM pk, KETQUADICHVUCLS cls, DICHVU dv, BACSI bs, HOADON hd, BENHNHAN bn
      WHERE pk.MAPK = cls.MAPK
      AND cls.MADVCLS = dv.MADV
      AND bs.MABS = cls.MABSTH
      AND hd.MAHD = cls.MAHD
      AND bn.MABN = pk.MABN`;

      const clsList = await db.executeQuery(sqlQuery);

      setTimeout(
        () =>
          res.status(200).send({
            errcode: 0,
            message: "Successful",
            data: clsList,
          }),
        1000
      );
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ 
        errcode: -1,
        message: "Lỗi ở server",
      });
    }
  }
}

module.exports = new ClsController();
