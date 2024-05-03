const db = require("../../config/db");
const oracledb = require("oracledb");
const { format } = require("date-fns");
const { DateTime2 } = require("mssql");

class HoaDonController {
  // POST /hoadon/insert
  async insert(req, res) {
    const { maLT, maLHD, tttt, ...others } = req.body;
    try {
      const sqlQuery = `BEGIN
        INSERT_HOADON(:p_maLT, :p_maLHD, :p_tdtt, :p_tttt, :p_thanhTien, :p_pttt, :maHDOut);
      END;`;

      const bindVars = {
        p_maLT: maLT,
        p_maLHD: maLHD,
        p_tdtt: null,
        p_tttt: tttt,
        p_thanhTien: 0,
        p_pttt: null,
        maHDOut: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      // Xử lý kết quả trả về
      res.status(200).json({
        errcode: 0,
        message: "Thêm hóa đơn mới thành công",
        MAHD: result.outBinds.maHDOut,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        errcode: -1,
        message: "Internal Server Error",
      });
    }
  }

  // GET /hoadon/dshd/:id-phieu-kham
  async fetchHDbyID(req, res) {
    try {
      const sqlQuery = `SELECT DISTINCT hd.MAHD, lhd.TENLOAIHD, hd.THANHTIEN, hd.TTTT, hd.TDTT, hd.PTTT, lt.HOTEN as TENLT
      FROM HOADON hd, PHIEUKHAM pk, KETQUADICHVUCLS cls, DONTHUOC dth, LOAIHD lhd, LETAN lt
      WHERE (hd.MAHD = pk.MAHD
      OR (pk.MAPK = dth.MAPK AND hd.MAHD = dth.MAHD)
      OR (pk.MAPK = cls.MAPK AND hd.MAHD = cls.MAHD) )
      AND hd.MALOAIHD = lhd.MALOAIHD
      AND hd.MALT = lt.MALT
      AND pk.MAPK = ${req.params.id}`;

      const hdList = await db.executeQuery(sqlQuery);

      if (hdList.length === 0) {
        res.status(200).json({
          errcode: 1,
          message: "No data found: Invalid MAPK",
          data: hdList,
        });
        return;
      }

      // Xử lý kết quả trả về
      res.status(200).json({
        errcode: 0,
        message: "Successful",
        data: hdList,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        errcode: -1,
        message: "Internal Server Error",
      });
    }
  }
}

module.exports = new HoaDonController();
