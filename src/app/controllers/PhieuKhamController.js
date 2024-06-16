const db = require("../../config/db");
const oracledb = require("oracledb");
const { format } = require("date-fns");
const { getSTTKham } = require("../../util/calculateSTT");

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
        v_MAPHONG: Math.floor(Math.random() * 3) + 100,
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
        PAR_MAPHONG: Math.floor(Math.random() * 3) + 100,
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
        INSERT_PHIEUKHAM(:PAR_MABN, :PAR_MADV, :PAR_MABS, :PAR_MAPHONG, :PAR_MAHD, :PAR_NGAY_KHAM, :PAR_NGAY_DAT_LICH, :PAR_TRANGTHAI, :PAR_STT, :PAR_HUYETAP, :PAR_CHIEUCAO, :PAR_CANNANG, :PAR_TRIEUCHUNGBENH, :PAR_LYDO, :PAR_TINHTRANG, :PAR_KETLUAN, :PAR_GIODATLICH, :MAPK_OUT);
      END; `;

      const bindVars = {
        PAR_MABN: maBN,
        PAR_MADV: dichVu,
        PAR_MABS: maBS,
        PAR_MAHD: maHD,
        PAR_MAPHONG: Math.floor(Math.random() * 3) + 100,
        PAR_NGAY_KHAM: new Date(ngayKham),
        PAR_NGAY_DAT_LICH: others?.ngayDatLich
          ? new Date(others.ngayDatLich)
          : null,
        PAR_TRANGTHAI: "Chưa thực hiện",
        PAR_STT: getSTTKham(new Date()), //Math.floor(Math.random() * 20) + 1,
        PAR_HUYETAP: null,
        PAR_CHIEUCAO: null,
        PAR_CANNANG: null,
        PAR_LYDO: lyDoKham,
        PAR_TRIEUCHUNGBENH: null,
        PAR_TINHTRANG: null,
        PAR_KETLUAN: null,
        PAR_GIODATLICH: others?.gioDatLich || null,
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

  // POST /phieukham/update-trang-thai
  async updateTrangThai(req, res) {
    const { trangThai, maPK, ...others } = req.body;
    try {
      const sqlQuery = `
      UPDATE PHIEUKHAM
      SET TRANGTHAITH = :p_TRANGTHAI
      WHERE MAPK = :p_MAPK`;

      const bindVars = {
        p_TRANGTHAI: trangThai,
        p_MAPK: maPK,
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      // Xử lý kết quả trả về
      res.status(200).json({
        errcode: 0,
        message: "Cập nhật trạng thái phiếu khám thành công",
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
      const sqlQuery = `SELECT DISTINCT pk.MAPK, pk.NGAYKHAM, pk.STT, bn.MABN, bn.HOTEN as TENBN, bn.NGAYSINH, bn.GIOITINH, bn.SDT, bs.MABS, bs.HOTEN as TENBS, bs.TRINHDO, dv.TENDV, dv.GIADV, pk.TRANGTHAITH, pk.GIODATLICH, 
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
      LEFT JOIN HOADON hd2 ON cls.MAHD = hd2.MAHD
      WHERE TRUNC(NGAYKHAM) <= TRUNC(SYSDATE)
      ORDER BY pk.NGAYKHAM DESC`;

      const dsDKKham = await db.executeQuery(sqlQuery);

      const formattedDSDKKham = dsDKKham.map((itemDKKham) => {
        itemDKKham.NGAYSINH = new Date(itemDKKham.NGAYSINH);
        itemDKKham.NGAYKHAM = new Date(itemDKKham.NGAYKHAM);
        const NGAYKHAMMIN = itemDKKham.GIODATLICH
          ? format(itemDKKham.NGAYKHAM, "dd/MM/yyyy") +
            " - " +
            itemDKKham.GIODATLICH
          : format(itemDKKham.NGAYKHAM, "dd/MM/yyyy - HH:mm");

        if (itemDKKham.TTTTCLS === null) {
          itemDKKham.TTTTCLS = "Không có đơn";
        }
        if (itemDKKham.TTTTDTH === null) {
          itemDKKham.TTTTDTH = "Không có đơn";
        }
        const INFOBN =
          itemDKKham.TENBN +
          "\n" +
          itemDKKham.GIOITINH +
          " - SĐT: " +
          itemDKKham.SDT;
        const INFOBS = "BS " + itemDKKham.TRINHDO + " " + itemDKKham.TENBS;
        const MAPKTG = "PK" + itemDKKham.MAPK + "\n" + NGAYKHAMMIN;
        return { ...itemDKKham, MAPKTG, INFOBN, INFOBS };
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

  // GET /phieukham/dslh
  async fetchDSLH(req, res) {
    try {
      const sqlQuery = `SELECT DISTINCT pk.MAPK, pk.NGAYKHAM, pk.STT, bn.MABN, bn.HOTEN as TENBN, bn.NGAYSINH, bn.GIOITINH, bn.SDT, bs.MABS, bs.HOTEN as TENBS, bs.TRINHDO, dv.TENDV, dv.GIADV, pk.TRANGTHAITH, pk.GIODATLICH, 
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
        LEFT JOIN HOADON hd2 ON cls.MAHD = hd2.MAHD
        WHERE TRUNC(NGAYKHAM) > TRUNC(SYSDATE)
        ORDER BY pk.NGAYKHAM ASC`;

      const dslh = await db.executeQuery(sqlQuery);

      const formatteddslh = dslh.map((item) => {
        item.NGAYSINH = new Date(item.NGAYSINH);
        item.NGAYKHAM = new Date(item.NGAYKHAM);
        const NGAYKHAMMIN = item.GIODATLICH
          ? format(item.NGAYKHAM, "dd/MM/yyyy") + " - " + item.GIODATLICH
          : format(item.NGAYKHAM, "dd/MM/yyyy - HH:mm");

        if (item.TTTTCLS === null) {
          item.TTTTCLS = "Không có đơn";
        }
        if (item.TTTTDTH === null) {
          item.TTTTDTH = "Không có đơn";
        }
        const INFOBN =
          item.TENBN + "\n" + item.GIOITINH + " - SĐT: " + item.SDT;
        const INFOBS = "BS " + item.TRINHDO + " " + item.TENBS;
        const MAPKTG = "PK" + item.MAPK + "\n" + NGAYKHAMMIN;
        return { ...item, MAPKTG, INFOBN, INFOBS };
      });

      res.status(200).json({
        errcode: 0,
        message: "Successful",
        data: formatteddslh,
      });
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Lỗi ở server" });
    }
  }

  // GET /phieukham/chitiet-pk/getById/:id
  async fetchKQKham(req, res) {
    try {
      const sqlQuery = `SELECT pk.MAPK, bs.HOTEN AS TENBS, bs.TRINHDO, dv.TENDV, .MAPHONG, NGAYKHAM, NGAYDATLICH, TRANGTHAITH, TTTT,
      LYDOKHAM, TRIEUCHUNGBENH, TINHTRANGCOTHE, KETLUAN, HUYETAP, CHIEUCAO, CANNANG, hd.MAHD, hd.TDTT, hd.THANHTIEN, pk.GIODATLICH, ph.TENPHONG, ph.SOPHONG, ph.TANG
      FROM PHIEUKHAM pk, BACSI bs, DICHVU dv, HOADON hd, PHONGKHAM ph
      WHERE pk.MABSC = bs.MABS
      AND pk.MADVK = dv.MADV
      AND hd.MAHD = pk.MAHD
      AND dv.MAPHONG = ph.MAPHONG
      AND pk.MAPK = ${req.params.id}`;

      let ctpk = await db.executeQuery(sqlQuery);

      const formattedCTPK = ctpk.map((item) => {
        const NGAYKHAMMIN = item.GIODATLICH
          ? format(item.NGAYKHAM, "dd/MM/yyyy") + " - " + item.GIODATLICH
          : format(item.NGAYKHAM, "dd/MM/yyyy - HH:mm");
        const TDTTMIN = item.TDTT
          ? format(item.TDTT, "dd/MM/yyyy - HH:mm")
          : "Chưa thanh toán";

        item.NGAYKHAM = new Date(item.NGAYKHAM);
        const INFOBS = "BS " + item.TRINHDO + " " + item.TENBS;
        return { ...item, INFOBS, NGAYKHAMMIN, TDTTMIN };
      });
      // làm lại khúc ni
      if (ctpk.length === 0) {
        res.status(200).json({
          errcode: 1,
          message: "No data found: invalid MAPK",
          data: formattedCTPK,
        });
        return;
      }

      let objCtpk = formattedCTPK[0];

      res.status(200).send({
        errcode: 0,
        message: "Successfull",
        data: objCtpk,
      });
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Lỗi ở server" });
    }
  }

  // GET /phieukham/ds-benh/getById/:id-phieu-kham
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

  // GET /phieukham/dspk/getById/:id-hoa-don
  async fetchPKbyIdHD(req, res) {
    try {
      const sqlQuery = `SELECT pk.MAPK, dv.TENDV, dv.GIADV, pk.TRANGTHAITH, hd.TTTT, hd.THANHTIEN, pk.NGAYKHAM, pk.GIADVLUCDK
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

      const formattedDSPK = pkList.map((itemDKKham) => {
        itemDKKham.NGAYKHAM = new Date(itemDKKham.NGAYKHAM);
        const NGAYKHAMMIN = format(itemDKKham.NGAYKHAM, "dd/MM/yyyy - HH:mm");
        return { ...itemDKKham, NGAYKHAMMIN };
      });

      res.status(200).send({
        errcode: 0,
        message: "Successfull",
        data: formattedDSPK,
      });
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Lỗi ở server" });
    }
  }

  // GET /phieukham/lichSuKham/getById/:id-benh-nhan
  async fetchLSKbyIdBN(req, res) {
    try {
      const sqlQuery = `SELECT pk.MAPK, dt.MADT, dv.TENDV, pk.TRANGTHAITH, pk.NGAYKHAM, pk.MAHD, pk.GIODATLICH
      FROM PHIEUKHAM pk, BENHNHAN bn, DICHVU dv, DONTHUOC dt
      WHERE pk.MABN = bn.MABN
      AND pk.MADVK = dv.MADV
      AND pk.MAPK = dt.MAPK
      AND bn.MABN = ${req.params.id}
      ORDER BY pk.NGAYKHAM`;

      let pkList = await db.executeQuery(sqlQuery);

      // làm lại khúc ni
      if (pkList.length === 0) {
        res.status(200).json({
          errcode: 1,
          message: "No data found: invalid MABN or BN ko co PK",
          data: pkList,
        });
        return;
      }

      const formattedDSPK = pkList.map((itemDKKham) => {
        itemDKKham.NGAYKHAM = new Date(itemDKKham.NGAYKHAM);
        const NGAYKHAMMIN = itemDKKham.GIODATLICH
          ? format(itemDKKham.NGAYKHAM, "dd/MM/yyyy") +
            " - " +
            itemDKKham.GIODATLICH
          : format(itemDKKham.NGAYKHAM, "dd/MM/yyyy - HH:mm");
        return { ...itemDKKham, NGAYKHAMMIN };
      });

      res.status(200).send({
        errcode: 0,
        message: "Successfull",
        data: formattedDSPK,
      });
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Lỗi ở server" });
    }
  }

  // POST /phieukham/ttk/getById
  async fetchTTKbyIdPK(req, res) {
    const { maPK } = req.body;
    try {
      const sqlQuery = `
        SELECT MAPK, TIENSUBENH, DIUNG, BS.HOTEN, BS.TRINHDO, DV.TENDV, TENPHONG, SOPHONG, TANG, NGAYKHAM, TRANGTHAITH, HUYETAP, LYDOKHAM, CHIEUCAO, CANNANG, TRIEUCHUNGBENH, TINHTRANGCOTHE, KETLUAN
        FROM PHIEUKHAM P, BENHNHAN B, PHONGKHAM PK, BACSI BS, DICHVU DV
        WHERE P.MABN = B.MABN
        AND DV.MADV = P.MADVK
        AND P.MABSC = BS.MABS
        AND P.MAPHONG = PK.MAPHONG
        AND MAPK = ${maPK}`;

      let ttk = await db.executeQuery(sqlQuery);

      if (ttk.length === 0) {
        res.status(200).json({
          errcode: 1,
          message: "No data found: invalid MAHD",
          data: ttk,
        });
        return;
      }

      const formattedTTK = ttk.map((itemDKKham) => {
        itemDKKham.NGAYKHAM = new Date(itemDKKham.NGAYKHAM);
        const NGAYKHAMMIN = format(itemDKKham.NGAYKHAM, "dd/MM/yyyy - HH:mm");
        return { ...itemDKKham, NGAYKHAMMIN };
      });

      res.status(200).send({
        errcode: 0,
        message: "Successfull",
        data: formattedTTK,
      });
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Lỗi ở server" });
    }
  }

  // POST /phieukham/ttk/dsBenh/getById
  async fetchDSBTTKbyIdPK(req, res) {
    const { maPK } = req.body;
    try {
      const sqlQuery = `
          SELECT B.MABENH, MAICD, TENBENH
          FROM CHITIETBENH C, BENH B
          WHERE C.MABENH = B.MABENH
          AND MAPK = ${maPK}`;

      let dsBenh = await db.executeQuery(sqlQuery);

      if (dsBenh.length === 0) {
        res.status(200).json({
          errcode: 1,
          message: "No data found",
          data: dsBenh,
        });
        return;
      }
      res.status(200).send({
        errcode: 0,
        message: "Successfull",
        data: dsBenh,
      });
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Lỗi ở server" });
    }
  }

  // POST /phieukham/update
  async update(req, res) {
    console.log(req.body);
    const {
      maPK,
      trieuChung,
      tinhTrangCoThe,
      ketLuan,
      huyetAp,
      chieuCao,
      canNang,
      benh,
    } = req.body;
    const maBenh = benh.map((item) => item.MABENH);
    try {
      const sqlQuery1 = ` 
        BEGIN
          UPDATE_PHIEUKHAM (:PAR_MAPK, :PAR_HUYETAP, :PAR_CHIEUCAO, :PAR_CANNANG, :PAR_TRIEUCHUNG, :PAR_TINHTRANG, :PAR_KETLUAN);   
        END; `;

      const bindVars = {
        PAR_MAPK: maPK,
        PAR_HUYETAP: huyetAp,
        PAR_CHIEUCAO: chieuCao,
        PAR_CANNANG: canNang,
        PAR_TRIEUCHUNG: trieuChung,
        PAR_TINHTRANG: tinhTrangCoThe,
        PAR_KETLUAN: ketLuan,
      };
      await db.executeProcedure(sqlQuery1, bindVars);

      const sqlQuery2 = `DELETE FROM CHITIETBENH WHERE MAPK = '${maPK}'`;
      await db.executeQuery(sqlQuery2);

      if (benh.length > 0) {
        for (const item of maBenh) {
          const sqlQuery = ` 
          BEGIN
            INSERT_CHITIETBENH (:PAR_MAPK, :PAR_MABENH);       
          END;`;
          const bindVars = {
            PAR_MAPK: maPK,
            PAR_MABENH: item,
          };

          await db.executeProcedure(sqlQuery, bindVars);
        }
      }

      // Xử lý kết quả trả về
      res.status(200).json({
        errcode: 0,
        message: "Cập nhật phiếu khám thành công",
        data: "",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        errcode: -1,
        message: "Lỗi ở server",
        data: "",
      });
    }
  }

  // GET /phieukham/ctpk/future/getById/:id
  async CTPKFutureById(req, res) {
    const date = req.params.id.toLowerCase();
    console.log("date", date);
    try {
      const sqlQuery = `
        SELECT * 
        FROM PHIEUKHAM P, DICHVU D
        WHERE P.MADVK = D.MADV
        AND MABN = ${req.params.id}
        AND TRUNC(NGAYKHAM) >= TRUNC(SYSDATE)
        ORDER BY NGAYKHAM`;

      let ctpk = await db.executeQuery(sqlQuery);
      console.log("ctpk", ctpk);

      const formattedCTPK = ctpk.map((item) => {
        const NGAYKHAMMIN = format(item.NGAYKHAM, "dd/MM/yyyy - HH:mm");
        item.NGAYKHAM = new Date(item.NGAYKHAM);
        return { ...item, NGAYKHAMMIN };
      });
      // làm lại khúc ni
      if (ctpk.length === 0) {
        res.status(200).json({
          errcode: 1,
          message: "No data found: invalid MAPK",
          data: formattedCTPK,
        });
        return;
      }

      res.status(200).send({
        errcode: 0,
        message: "Successfull",
        data: formattedCTPK,
      });
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Lỗi ở server" });
    }
  }
}

module.exports = new PhieuKhamController();
