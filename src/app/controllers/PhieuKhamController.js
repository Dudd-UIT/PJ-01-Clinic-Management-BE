const db = require("../../config/db");
const oracledb = require("oracledb");
const { format } = require("date-fns");

class PhieuKhamController {
  // POST /phieukham/insert-pk -- api nay insert PK cho cac BN da co ho so
  async insertPK(req, res) {
    // maHD duoc update o trong procedure
    // cac thuoc tinh con lai la null, se dc cap nhat trong khi kham benh
    // STT tinh ntn?, where?
    const { maBN, maBS, dichVu, ngayKham, lyDoKham, ...others } = req.body;
    try {
      const sqlQuery = ` BEGIN
          INSERT_PHIEUKHAM_HOADON(:v_MABN, :v_MADV, :v_MABS, :v_MAPHONG, :v_NGAY_KHAM, :v_NGAY_DAT_LICH, :v_TRANGTHAI, :v_STT, :v_HUYETAP, :v_CHIEUCAO, :v_CANNANG, :v_LYDO, :v_TRIEUCHUNGBENH, :v_TINHTRANG, :v_KETLUAN);
        END; `;

      const bindVars = {
        v_MABN: maBN,
        v_MADV: dichVu,
        v_MABS: maBS,
        v_MAPHONG: Math.floor(Math.random() * 4) + 1,
        v_NGAY_KHAM: new Date(ngayKham),
        v_NGAY_DAT_LICH: null,
        v_TRANGTHAI: "Dang thuc hien",
        v_STT: Math.floor(Math.random() * 20) + 1,
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
      res.status(200).json({
        errcode: 0,
        message: "Thêm phiếu khám và hóa đơn thành công",
      });
    } catch (error) {
      console.error("Error calling procedure:", error);
      res.status(500).json({
        errcode: -1,
        message: "Lỗi ở server",
      });
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
      dichVu,
      ngayKham,
      lyDoKham,
      ...others
    } = req.body;

    try {
      const sqlQuery = ` BEGIN
          INSERT_PHIEUKHAM_HOADON_BENHNHAN(:par_cccd, :par_HoTen, :par_NgaySinh, :par_GioiTinh, :par_sdt, :par_DiaChi, :par_TienSuBenh, :par_DiUng, :PAR_MADV, :PAR_MABS, :PAR_MAPHONG, :PAR_NGAY_KHAM, :PAR_NGAY_DAT_LICH, :PAR_TRANGTHAI, :PAR_STT, :PAR_HUYETAP, :PAR_CHIEUCAO, :PAR_CANNANG, :PAR_TRIEUCHUNG, :PAR_LYDO, :PAR_TINHTRANG, :PAR_KETLUAN, :v_mabnold);
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
        PAR_MADV: dichVu,
        PAR_MABS: maBS,
        PAR_MAPHONG: Math.floor(Math.random() * 4) + 1,
        PAR_NGAY_KHAM: new Date(ngayKham),
        PAR_NGAY_DAT_LICH: null,
        PAR_TRANGTHAI: "Dang thuc hien",
        PAR_STT: Math.floor(Math.random() * 20) + 1,
        PAR_HUYETAP: null,
        PAR_CHIEUCAO: null,
        PAR_CANNANG: null,
        PAR_TRIEUCHUNG: null,
        PAR_LYDO: lyDoKham,
        PAR_TINHTRANG: null,
        PAR_KETLUAN: null,
        v_mabnold: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      };
      const result1 = await db.executeProcedure(sqlQuery, bindVars);

      // Xử lý kết quả trả về
      res.status(200).json({
        errcode: 0,
        message: "Data BENHNHAN, PHIEUKHAM, HOADON inserted successfully",
        maBNOld: result1.outBinds.v_mabnold,
      });
    } catch (error) {
      console.error("Error calling procedure:", error);
      res.status(500).json({ error: "Lỗi ở server" });
    }
  }

  // POST /phieukham/insert-just-pk
  async insertIustPK(req, res) {
    const { maBN, maBS, maHD, dichVu, ngayKham, lyDoKham, ...others } =
      req.body;
    try {
      const sqlQuery = ` BEGIN
        INSERT_PHIEUKHAM(:PAR_MABN, :PAR_MADV, :PAR_MABS, :PAR_MAPHONG, :PAR_MAHD, :PAR_NGAY_KHAM, :PAR_NGAY_DAT_LICH, :PAR_TRANGTHAI, :PAR_STT, :PAR_HUYETAP, :PAR_CHIEUCAO, :PAR_CANNANG, :PAR_TRIEUCHUNGBENH, :PAR_LYDO, :PAR_TINHTRANG, :PAR_KETLUAN, :MAPK_OUT);
      END; `;

      const bindVars = {
        PAR_MABN: maBN,
        PAR_MADV: dichVu,
        PAR_MABS: maBS,
        PAR_MAHD: maHD,
        PAR_MAPHONG: Math.floor(Math.random() * 4) + 1,
        PAR_NGAY_KHAM: new Date(ngayKham),
        PAR_NGAY_DAT_LICH: null,
        PAR_TRANGTHAI: "Dang thuc hien",
        PAR_STT: Math.floor(Math.random() * 20) + 1,
        PAR_HUYETAP: null,
        PAR_CHIEUCAO: null,
        PAR_CANNANG: null,
        PAR_LYDO: lyDoKham,
        PAR_TRIEUCHUNGBENH: null,
        PAR_TINHTRANG: null,
        PAR_KETLUAN: null,
        MAPK_OUT: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      // Xử lý kết quả trả về
      res.status(200).json({
        errcode: 0,
        message: "Thêm phiếu khám thành công",
        MAPK: result.outBinds.MAPK_OUT,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        errcode: -1,
        message: "Lỗi ở server",
      });
    }
  }

  // GET /phieukham/dsdk
  async fetchDSDK(req, res) {
    try {
      const sqlQuery = `SELECT DISTINCT pk.MAPK, pk.NGAYKHAM, pk.STT, bn.MABN, bn.HOTEN as TENBN, bn.NGAYSINH, bn.GIOITINH, bn.SDT, bs.HOTEN as TENBS, bs.TRINHDO, dv.TENDV, dv.GIADV, pk.TRANGTHAITH, 
      hd.MAHD as MAHDPK, hd.TTTT as TTTTPK,
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
        itemDKKham.NGAYKHAM = new Date(itemDKKham.NGAYKHAM);
        itemDKKham.NGAYSINH = new Date(itemDKKham.NGAYSINH);
        return itemDKKham;
      });

      res.status(200).json({
        errcode: 0,
        message: "Successful",
        data: formattedDSDKKham,
      });
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Lỗi ở server" });
    }
  }

  // GET /phieukham/chitiet-pk/:id
  async fetchKQKham(req, res) {
    try {
      const sqlQuery = `SELECT pk.MAPK, bs.HOTEN AS TENBS, bs.TRINHDO, dv.TENDV, MAPHONG, NGAYKHAM, NGAYDATLICH, TRANGTHAITH, 
      LYDOKHAM, TRIEUCHUNGBENH, TINHTRANGCOTHE, KETLUAN, HUYETAP, CHIEUCAO, CANNANG
      FROM PHIEUKHAM pk, BACSI bs, DICHVU dv
      WHERE pk.MABSC = bs.MABS
      AND pk.MADVK = dv.MADV
      AND pk.MAPK = ${req.params.id}`;

      let ctpk = await db.executeQuery(sqlQuery);

      // làm lại khúc ni
      if (ctpk.length === 0) {
        res.status(200).json({
          errcode: 1,
          message: "No data found: invalid MAPK",
          data: ctpk,
        });
        return;
      }

      let objCtpk = ctpk[0];

      setTimeout(
        () =>
          res.status(200).send({
            errcode: 0,
            message: "Successfull",
            data: objCtpk,
          }),
        1000
      );
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Lỗi ở server" });
    }
  }

  // GET /phieukham/ds-benh/:id
  async fetchDSBenh(req, res) {
    try {
      const sqlQuery = `SELECT b.MAICD, b.TENBENH
      FROM PHIEUKHAM pk, CHITIETBENH ctb, BENH b
      WHERE pk.MAPK = ctb.MAPK
      AND ctb.MAICD = b.MAICD
      AND pk.MAPK = ${req.params.id}`;

      const benhList = await db.executeQuery(sqlQuery);

      // xử lý trường hợp nhận được mảng rỗng
      if (benhList.length === 0) {
        res.status(500).send({
          errcode: 1,
          message: "No data found: DS Benh rong or Invalid MAPK",
          data: benhList,
        });
        return;
      }

      setTimeout(
        () =>
          res.status(200).send({
            errcode: 0,
            message: "Successful",
            data: benhList,
          }),
        1000
      );
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({
        errcode: 2,
        message: "Lỗi ở server",
      });
    }
  }

  // GET /phieukham/dspk/:id-hoa-don
  async fetchPKbyIdHD(req, res) {
    try {
      const sqlQuery = `SELECT pk.MAPK, dv.TENDV, dv.GIADV, pk.TRANGTHAITH, hd.TTTT, hd.THANHTIEN
      FROM PHIEUKHAM pk, HOADON hd, DICHVU dv
      WHERE pk.MAHD = hd.MAHD
      AND pk.MADVK = dv.MADV
      AND hd.MAHD = ${req.params.id}`;

      let pkList = await db.executeQuery(sqlQuery);

      // làm lại khúc ni
      if (pkList.length === 0) {
        res.status(200).json({
          errcode: 1,
          message: "No data found: invalid MAHD",
          data: pkList,
        });
        return;
      }

      setTimeout(
        () =>
          res.status(200).send({
            errcode: 0,
            message: "Successfull",
            data: pkList,
          }),
        1000
      );
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Lỗi ở server" });
    }
  }
}

module.exports = new PhieuKhamController();
