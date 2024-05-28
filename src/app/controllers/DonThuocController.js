const db = require("../../config/db");
const oracledb = require("oracledb");
const { format } = require("date-fns");

class DonThuocController {
  // POST /donthuoc/insert
  async insert(req, res) {
    const { maPK, maLT, ...others } = req.body;
    try {
      const sqlQuery = `BEGIN
      INSERT_DONTHUOC_HOADON(:p_MAPK, :p_MALT, :p_GIADONTHUOC, :p_THOIGIANLAP, :MADT_OUT);
      END;`;

      const bindVars = {
        p_MAPK: maPK,
        p_MALT: maLT,
        p_GIADONTHUOC: 0,
        p_THOIGIANLAP: new Date(),
        MADT_OUT: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      // Xử lý kết quả trả về
      res.status(200).json({
        errcode: 0,
        message: "Thêm hóa đơn và đơn thuốc mới thành công",
        MADT: result.outBinds.MADT_OUT,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        errcode: -1,
        message: "Internal Server Error",
      });
    }
  }

  // POST /donthuoc/insert-ctdt
  async insertCTDT(req, res) {
    const {
      maDT,
      MATHUOC,
      SOLANUONG,
      SOLUONGUONG,
      SOLUONGTHUOC,
      GIABANLUCKE,
      GHICHU,
      ...others
    } = req.body;
    try {
      const sqlQuery = `BEGIN
      INSERT_CTDT (:PAR_MADT, :PAR_MATHUOC, :PAR_SOLANUONG, :PAR_SOLUONGUONG, :PAR_TRANGTHAI, :PAR_SOLUONGTHUOC, :PAR_GIABAN, :PAR_GHICHU);      
      END;`;

      const bindVars = {
        PAR_MADT: maDT,
        PAR_MATHUOC: MATHUOC,
        PAR_SOLANUONG: SOLANUONG,
        PAR_SOLUONGUONG: SOLUONGUONG,
        PAR_TRANGTHAI: "Chưa đặt lịch",
        PAR_SOLUONGTHUOC: SOLUONGTHUOC,
        PAR_GIABAN: GIABANLUCKE,
        PAR_GHICHU: GHICHU,
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      // Xử lý kết quả trả về
      res.status(200).json({
        errcode: 0,
        message: "Thêm chi tiết đơn thuốc thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        errcode: -1,
        message: "Internal Server Error",
      });
    }
  }

  // GET /ds-thuoc/getById/:id-phieu-kham
  async fetchDSThuoc(req, res) {
    try {
      const sqlQuery = `
      SELECT distinct th.MATHUOC, TENTHUOC, THANHPHAN, TENDONVI, SOLUONGTHUOC, GIABANLUCKE, SOLANUONG, SOLUONGUONG, GHICHU, hd.MAHD, hd.THANHTIEN, TTTT, TDTT, HOTEN
      FROM DONTHUOC dth, CTDT, THUOC th, DONVITHUOC dvth, HOADON hd, LETAN lt
      WHERE dth.MADT = ctdt.MADT
      AND ctdt.MATHUOC = th.MATHUOC
      AND th.MADVT = dvth.MADVT
      AND dth.MAHD = hd.MAHD
      AND hd.MALT = lt.MALT
      AND dth.MAPK = ${req.params.id}`;

      const thuocList = await db.executeQuery(sqlQuery);
      console.log("thuocList", thuocList);
      // coi lại khúc ni
      if (thuocList.length === 0) {
        res.status(200).json({
          errcode: 1,
          message: "No data found: don thuoc chua co data or Invalid MAPK",
          data: thuocList,
        });
        return;
      }

      const formattedThuocList = thuocList.map((thuoc) => {
        const TDTTMIN = thuoc.TDTT
          ? format(thuoc.TDTT, "dd/MM/yyyy - HH:mm")
          : "Chưa thanh toán";
        thuoc.TDTT = new Date(thuoc.TDTT);

        return {
          ...thuoc,
          thanhTien: thuoc.GIABANLUCKE * thuoc.SOLUONGTHUOC,
          TDTTMIN,
        };
      });

      res.status(200).send({
        errcode: 0,
        message: "Successful",
        data: formattedThuocList,
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

module.exports = new DonThuocController();
