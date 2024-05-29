const multer = require("multer");
const db = require("../../config/db");
const oracledb = require("oracledb");
const { format } = require("date-fns");
const { Json } = require("sequelize/lib/utils");
const getImage = require("../../util/getImage");

class ClsController {
  // POST /cls/insert-just-cls
  async insertIustCLS(req, res) {
    const { MAPK, MABS, MAHD, MADV, ...others } = req.body;
    try {
      const sqlQuery = ` BEGIN
        INSERT_KETQUADVCLS(:p_MAPK, :p_MABSTH, :p_MADVCLS, :p_MAPHONG, :p_MAHD, :p_TRANGTHAITH, :p_STT, :p_MOTA, :p_KETLUANCLS, :p_THOIGIANTAO);
      END; `;

      const bindVars = {
        p_MAPK: MAPK,
        p_MABSTH: MABS,
        p_MADVCLS: MADV,
        p_MAPHONG: Math.floor(Math.random() * 3) + 1,
        p_MAHD: MAHD,
        p_TRANGTHAITH: "Chưa thực hiện",
        p_STT: Math.floor(Math.random() * 20) + 1,
        p_MOTA: null,
        p_KETLUANCLS: null,
        p_THOIGIANTAO: new Date(),
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

  // POST /cls/update-cls
  async updateCls(req, res) {
    const { MAKQ, MOTA, KETLUANCLS } = req.body;
    console.log(req.body);

    const image = req.file ? req.file.filename : null;

    if (image) {
      console.log("Uploaded file:", image);
    } else {
      console.log("No file uploaded");
    }

    try {
      const sqlQuery = ` BEGIN
        UPDATE_KETQUADVCLS(:p_MAKQ, :p_TRANGTHAITH, :p_MOTA, :p_KETLUANCLS, :p_IMAGE);
      END; `;

      const bindVars = {
        p_MAKQ: MAKQ,
        p_TRANGTHAITH: "Đã hoàn thành",
        p_MOTA: MOTA,
        p_KETLUANCLS: KETLUANCLS,
        p_IMAGE: image,
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      // Xử lý kết quả trả về
      res.status(200).json({
        errcode: 0,
        message: "Cập nhật thông tin phiếu CLS thành công",
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
      const sqlQuery = `SELECT cls.MAKQ, cls.IMAGE, pk.MAPK, pk.NGAYKHAM, dv.MADV, ldv.TENLOAIDV, dv.TENDV, dv.GIADV, cls.TRANGTHAITH, cls.GIADVCLSLUCDK, hd.TTTT, hd.MAHD, hd.TDTT, hd.THANHTIEN, bn.HOTEN AS TENBN, bn.NGAYSINH, bn.GIOITINH, bn.SDT, bs1.HOTEN as TENBSTH, bs1.TRINHDO as TRINHDOBSTH, bs2.HOTEN as TENBSCD, bs2.TRINHDO as TRINHDOBSCD, cls.MOTA, cls.KETLUANCLS, cls.THOIGIANTAO
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
      console.log("clsList", clsList);

      // clsList[1].IMAGE = getImage(clsList[1]?.IMAGE);
      // console.log('clsList[0].IMAGE', clsList[0].IMAGE);

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
        item.IMAGE = getImage(item.IMAGE);
        const NGAYKHAMMIN = format(item.THOIGIANTAO, "dd/MM/yyyy - HH:mm");
        const TDTTMIN = item.TDTT
          ? format(item.TDTT, "dd/MM/yyyy - HH:mm")
          : "Chưa thanh toán";

        item.NGAYKHAM = new Date(item.NGAYKHAM);
        const INFOBN =
          item.TENBN + "\n" + item.GIOITINH + " - SĐT: " + item.SDT;
        const INFOBSTH = "BS " + item.TRINHDOBSTH + " " + item.TENBSTH;
        const INFOBSCD = "BS " + item.TRINHDOBSCD + " " + item.TENBSCD;
        const MAKQPKTG =
          "KQ" + item.MAKQ + " - PK" + item.MAPK + "\n" + NGAYKHAMMIN;
        return {
          ...item,
          MAKQPKTG,
          INFOBN,
          INFOBSTH,
          INFOBSCD,
          NGAYKHAMMIN,
          TDTTMIN,
        };
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
      const sqlQuery = `SELECT cls.MAKQ, cls.IMAGE, pk.MAPK, pk.NGAYKHAM, cls.STT, bn.HOTEN AS TENBN, bn.NGAYSINH, bn.GIOITINH, bn.SDT, bs1.HOTEN as TENBSTH, bs1.TRINHDO as TRINHDOBSTH, bs2.HOTEN as TENBSCD, bs2.TRINHDO as TRINHDOBSCD, dv.TENDV, cls.TRANGTHAITH, hd.TTTT, cls.MOTA, cls.IMAGE, cls.KETLUANCLS, cls.THOIGIANTAO
      FROM PHIEUKHAM pk, KETQUADICHVUCLS cls, DICHVU dv, BACSI bs1, BACSI bs2, HOADON hd, BENHNHAN bn
      WHERE pk.MAPK = cls.MAPK
      AND cls.MADVCLS = dv.MADV
      AND bs1.MABS = cls.MABSTH
      AND bs2.MABS = pk.MABSC
      AND hd.MAHD = cls.MAHD
      AND bn.MABN = pk.MABN
      ORDER BY pk.NGAYKHAM DESC`;

      const clsList = await db.executeQuery(sqlQuery);

      const formattedClsList = clsList.map((item) => {
        item.IMAGE = getImage(item.IMAGE);
        item.NGAYKHAM = new Date(item.NGAYKHAM);
        const INFOBN =
          item.TENBN + "\n" + item.GIOITINH + " - SĐT: " + item.SDT;
        const INFOBSTH = "BS " + item.TRINHDOBSTH + " " + item.TENBSTH;
        const INFOBSCD = "BS " + item.TRINHDOBSCD + " " + item.TENBSCD;
        const MAKQPKTG =
          "KQ" +
          item.MAKQ +
          " - PK" +
          item.MAPK +
          "\n" +
          format(item.THOIGIANTAO, "dd/MM/yyyy - HH:mm");
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
