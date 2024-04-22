const db = require("../../config/db");
const oracledb = require("oracledb");
const { format } = require("date-fns");

class PhieuKhamController {
  // POST /phieukham/insert-pk -- api nay insert PK cho cac BN da co ho so
  async insertPK(req, res) {
    // maHD duoc update o trong procedure
    // cac thuoc tinh con lai la null, se dc cap nhat trong khi kham benh
    // STT tinh ntn?, where?
    const {
      maBN,
      maBS,
      maDV,
      maPhong,
      ngayKham,
      lyDoKham,
      STT,
      trangThai,
      ...others
    } = req.body;
    try {
      const sqlQuery = ` BEGIN
          INSERT_PHIEUKHAM_UPDATE(:v_MABN, :v_MADV, :v_MABS, :v_MAPHONG, :v_NGAY_KHAM, :v_NGAY_DAT_LICH, :v_TRANGTHAI, :v_STT, :v_HUYETAP, :v_CHIEUCAO, :v_CANNANG, :v_LYDO, :v_TINHTRANG, :v_KETLUAN);
        END; `;

      const bindVars = {
        v_MABN: maBN,
        v_MADV: maDV,
        v_MABS: maBS,
        v_MAPHONG: maPhong,
        v_NGAY_KHAM: new Date(ngayKham),
        v_NGAY_DAT_LICH: null,
        v_TRANGTHAI: trangThai,
        v_STT: STT,
        v_HUYETAP: null,
        v_CHIEUCAO: null,
        v_CANNANG: null,
        v_LYDO: lyDoKham,
        v_TINHTRANG: null,
        v_KETLUAN: null,
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      // Xử lý kết quả trả về
      res.status(200).json({ message: "Data PHIEUKHAM inserted successfully" });
    } catch (error) {
      console.error("Error calling procedure:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new PhieuKhamController();
