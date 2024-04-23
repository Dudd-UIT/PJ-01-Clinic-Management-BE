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
          INSERT_PHIEUKHAM_HOADON(:v_MABN, :v_MADV, :v_MABS, :v_MAPHONG, :v_NGAY_KHAM, :v_NGAY_DAT_LICH, :v_TRANGTHAI, :v_STT, :v_HUYETAP, :v_CHIEUCAO, :v_CANNANG, :v_LYDO, :v_TRIEUCHUNGBENH, :v_TINHTRANG, :v_KETLUAN);
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
        v_TRIEUCHUNGBENH: null,
        v_TINHTRANG: null,
        v_KETLUAN: null,
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      // Xử lý kết quả trả về
      res
        .status(200)
        .json({ message: "Data PHIEUKHAM, HOADON inserted successfully" });
    } catch (error) {
      console.error("Error calling procedure:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // POST /phieukham/insert-bn-pk
  // api nay insert ho so benh nhan sau do insert phieu kham cho ho so vua tao
  async insertBNPK(req, res) {
    // maBN, maHD dc tao o trong procedure
    const {
      hoTen,
      gioiTinh,
      diaChi,
      ngaySinh,
      cccd,
      soDienThoai,
      diUng,
      tienSuBenh, // bên UI sửa lại tham số cho giống
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
          INSERT_PHIEUKHAM_HOADON_BENHNHAN(:par_cccd, :par_HoTen, :par_NgaySinh, :par_GioiTinh, :par_sdt, :par_DiaChi, :par_TienSuBenh, :par_DiUng, :PAR_MADV, :PAR_MABS, :PAR_MAPHONG, :PAR_NGAY_KHAM, :PAR_NGAY_DAT_LICH, :PAR_TRANGTHAI, :PAR_STT, :PAR_HUYETAP, :PAR_CHIEUCAO, :PAR_CANNANG, :PAR_TRIEUCHUNG, :PAR_LYDO, :PAR_TINHTRANG, :PAR_KETLUAN);
        END; `;

      const bindVars = {
        par_cccd: cccd,
        par_HoTen: hoTen,
        par_NgaySinh: new Date(ngaySinh),
        par_GioiTinh: gioiTinh,
        par_sdt: soDienThoai,
        par_DiaChi: diaChi,
        par_TienSuBenh: tienSuBenh,
        par_DiUng: diUng,
        PAR_MADV: maDV,
        PAR_MABS: maBS,
        PAR_MAPHONG: maPhong,
        PAR_NGAY_KHAM: new Date(ngayKham),
        PAR_NGAY_DAT_LICH: null,
        PAR_TRANGTHAI: trangThai,
        PAR_STT: STT,
        PAR_HUYETAP: null,
        PAR_CHIEUCAO: null,
        PAR_CANNANG: null,
        PAR_TRIEUCHUNG: null,
        PAR_LYDO: lyDoKham,
        PAR_TINHTRANG: null,
        PAR_KETLUAN: null,
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      // Xử lý kết quả trả về
      res.status(200).json({
        message: "Data BENHNHAN, PHIEUKHAM, HOADON inserted successfully",
      });
    } catch (error) {
      console.error("Error calling procedure:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // GET /phieukham/dsdk
  async fetchDSDK(req, res) {
    try {
      const sqlQuery = `SELECT DISTINCT pk.MAPK, pk.NGAYKHAM, pk.STT, bn.HOTEN as TENBN, bn.NGAYSINH, bn.GIOITINH, bn.SDT, bs.HOTEN as TENBS, bs.TRINHDO, dv.TENDV, pk.TRANGTHAITH, hd.TTTT as TTTTPK,
      hd1.THANHTIEN AS TIENTHUOC, hd1.TTTT AS TTTTDTH, 
      hd2.THANHTIEN AS TIENCLS, hd2.TTTT AS TTTTCLS
      FROM PHIEUKHAM pk
      JOIN BENHNHAN bn ON pk.MABN = bn.MABN
      JOIN BACSI bs on pk.MABSC = bs.MABS
      JOIN DICHVU dv on pk.MADVK = dv.MADV
      JOIN HOADON hd ON pk.MAHD = hd.MAHD
      LEFT JOIN DONTHUOC dth ON pk.MAPK = dth.MAPK
      LEFT JOIN HOADON hd1 ON dth.MAHD = hd1.MAHD 
      LEFT JOIN KETQUADICHVUCLS cls ON pk.MAPK = cls.MAPK
      LEFT JOIN HOADON hd2 ON cls.MAHD = hd2.MAHD`;

      const dsDKKham = await db.executeQuery(sqlQuery);

      const formattedDSDKKham = dsDKKham.map((itemDKKham) => {
        const [
          MAPK,
          NGAYKHAM,
          STT,
          TENBN,
          NGAYSINH,
          GIOITINH,
          SDT,
          TENBS,
          TRINHDO,
          TENDV,
          TRANGTHAIKHAM,
          TTTTPK,
          TIENTHUOC,
          TTTTDTH,
          TIENCLS,
          TTTTCLS,
        ] = itemDKKham;

        return {
          MAPK,
          NGAYKHAM: new Date(NGAYKHAM),
          STT,
          TENBN,
          NGAYSINH: new Date(NGAYSINH),
          GIOITINH,
          SDT,
          TENBS,
          TRINHDO,
          TENDV,
          TRANGTHAIKHAM,
          TTTTPK,
          TIENTHUOC,
          TTTTDTH,
          TIENCLS,
          TTTTCLS,
        };
      });

      setTimeout(() => res.send(formattedDSDKKham), 1000);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new PhieuKhamController();
