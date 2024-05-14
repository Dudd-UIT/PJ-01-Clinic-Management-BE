const db = require("../../config/db");
const oracledb = require("oracledb");
const { format } = require("date-fns");

class ClsController {
  // POST /cls/insert-just-cls
  async insertIustCLS(req, res) {
    const { MAPK, MABS, MAHD, MADV, ...others } = req.body;
    try {
      const sqlQuery = ` BEGIN
        INSERT_KETQUADVCLS(:p_MAPK, :p_MABSTH, :p_MADVCLS, :p_MAPHONG, :p_MAHD, :p_TRANGTHAITH, :p_STT, :p_KETLUANCLS);
      END; `;

      const bindVars = {
        p_MAPK: MAPK,
        p_MABSTH: MABS,
        p_MADVCLS: MADV,
        p_MAPHONG: Math.floor(Math.random() * 3) + 1,
        p_MAHD: MAHD,
        p_TRANGTHAITH: "Chưa thực hiện",
        p_STT: Math.floor(Math.random() * 20) + 1,
        p_KETLUANCLS: null,
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      // Xử lý kết quả trả về
      res.status(200).json({
        errcode: 0,
        message: "Thêm phiếu CLS thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        errcode: -1,
        message: "Lỗi ở server",
      });
    }
  }

  // GET /ds-cls/getById/:id
  async fetchClsById(req, res) {
    try {
      const sqlQuery = `SELECT cls.MAKQ, pk.MAPK, pk.NGAYKHAM, dv.MADV, ldv.TENLOAIDV, dv.TENDV, dv.GIADV, cls.TRANGTHAITH, hd.TTTT, bn.HOTEN AS TENBN, bn.NGAYSINH, bn.GIOITINH, bn.SDT, bs1.HOTEN as TENBSTH, bs1.TRINHDO as TRINHDOBSTH, bs2.HOTEN as TENBSCD, bs2.TRINHDO as TRINHDOBSCD
      FROM PHIEUKHAM pk, KETQUADICHVUCLS cls, DICHVU dv, HOADON hd, LOAIDV ldv, BACSI bs1, BACSi bs2, BENHNHAN bn
      WHERE pk.MAPK = cls.MAPK
      AND cls.MADVCLS = dv.MADV
      AND ldv.MALOAIDV = dv.MALOAIDV
      AND hd.MAHD = cls.MAHD
      AND bs1.MABS = cls.MABSTH
      AND bs2.MABS = pk.MABSC
      AND bn.MABN = pk.MABN
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

      const formattedDSCLS = clsList.map((item) => {
        const NGAYKHAMMIN = format(item.NGAYKHAM, "dd/MM/yyyy - HH:mm");
        item.NGAYKHAM = new Date(item.NGAYKHAM);
        const INFOBN =
        item.TENBN +
          "\n" +
          item.GIOITINH +
          " - SĐT: " +
          item.SDT;
        const INFOBSTH = "BS " + item.TRINHDOBSTH + " " + item.TENBSTH;
        const INFOBSCD = "BS " + item.TRINHDOBSCD + " " + item.TENBSCD;
        const MAKQPKTG = "KQ"+ item.MAKQ +
          " - PK" +
          item.MAPK +
          "\n" +
          format(item.NGAYKHAM, "dd/MM/yyyy - HH:mm");
        return { ...item, MAKQPKTG, INFOBN, INFOBSTH, INFOBSCD, NGAYKHAMMIN };
      });

      res.status(200).send({
        errcode: 0,
        message: "Successful",
        data: formattedDSCLS,
      });
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
      const sqlQuery = `SELECT cls.MAKQ, pk.MAPK, pk.NGAYKHAM, cls.STT, bn.HOTEN AS TENBN, bn.NGAYSINH, bn.GIOITINH, bn.SDT, bs1.HOTEN as TENBSTH, bs1.TRINHDO as TRINHDOBSTH, bs2.HOTEN as TENBSCD, bs2.TRINHDO as TRINHDOBSCD, dv.TENDV, cls.TRANGTHAITH, hd.TTTT
      FROM PHIEUKHAM pk, KETQUADICHVUCLS cls, DICHVU dv, BACSI bs1, BACSI bs2, HOADON hd, BENHNHAN bn
      WHERE pk.MAPK = cls.MAPK
      AND cls.MADVCLS = dv.MADV
      AND bs1.MABS = cls.MABSTH
      AND bs2.MABS = pk.MABSC
      AND hd.MAHD = cls.MAHD
      AND bn.MABN = pk.MABN
      ORDER BY pk.NGAYKHAM`;

      const clsList = await db.executeQuery(sqlQuery);

      const formattedClsList = clsList.map((item) => {
        item.NGAYKHAM = new Date(item.NGAYKHAM);
        const INFOBN =
        item.TENBN +
          "\n" +
          item.GIOITINH +
          " - SĐT: " +
          item.SDT;
        const INFOBSTH = "BS " + item.TRINHDOBSTH + " " + item.TENBSTH;
        const INFOBSCD = "BS " + item.TRINHDOBSCD + " " + item.TENBSCD;
        const MAKQPKTG = "KQ"+ item.MAKQ +
          " - PK" +
          item.MAPK +
          "\n" +
          format(item.NGAYKHAM, "dd/MM/yyyy - HH:mm");
        return { ...item, MAKQPKTG, INFOBN, INFOBSTH, INFOBSCD };
      });

      res.status(200).send({
        errcode: 0,
        message: "Successful",
        data: formattedClsList,
      });
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
