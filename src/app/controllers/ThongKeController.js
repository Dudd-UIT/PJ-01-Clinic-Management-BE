const { handleUserLogin } = require("../../services/UserService");
const db = require("../../config/db");

// GET /thongke/dichvu/tt-db
const dichVuKham = async (req, res) => {
  try {
    const sqlQuery = ` 
    SELECT  TO_CHAR(HD.TDTT, 'MM') AS month, TO_CHAR(HD.TDTT, 'YYYY') AS year, 
    DV.TENDV AS name, DV.MADV AS id, COUNT(*) AS frequency, SUM(HD.THANHTIEN) AS bill, L.TENLOAIDV AS type
    FROM PHIEUKHAM P, HOADON HD, DICHVU DV, LOAIDV L
    WHERE P.MAHD = HD.MAHD
    AND P.MADVK = DV.MADV
    AND L.MALOAIDV = DV.MALOAIDV
    AND HD.TTTT = 'Đã thanh toán'
    GROUP BY TO_CHAR(HD.TDTT, 'MM'), TO_CHAR(HD.TDTT, 'YYYY'), DV.TENDV, DV.MADV, L.TENLOAIDV
    ORDER BY TO_CHAR(HD.TDTT, 'YYYY'), TO_CHAR(HD.TDTT, 'MM')`;

    const tkDichVu = await db.executeQuery(sqlQuery);

    res.status(200).json({
      errcode: 0,
      message: "Successful",
      data: tkDichVu,
    });
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({
      errcode: -1,
      message: "Error from server",
      data: [],
    });
  }
};

// GET /thongke/dichvu/cls
const dichVuCLS = async (req, res) => {
  try {
    const sqlQuery = ` 
        SELECT  TO_CHAR(HD.TDTT, 'MM') AS month, TO_CHAR(HD.TDTT, 'YYYY') AS year, 
        DV.TENDV AS name, DV.MADV AS id, COUNT(*) AS frequency, SUM(HD.THANHTIEN) AS bill, L.TENLOAIDV AS type
        FROM HOADON HD, DICHVU DV, LOAIDV L, KETQUADICHVUCLS K
        WHERE K.MAHD = HD.MAHD
        AND K.MADVCLS = DV.MADV
        AND L.MALOAIDV = DV.MALOAIDV
        AND HD.TTTT = 'Đã thanh toán'
        GROUP BY TO_CHAR(HD.TDTT, 'MM'), TO_CHAR(HD.TDTT, 'YYYY'), DV.TENDV, DV.MADV, L.TENLOAIDV
        ORDER BY TO_CHAR(HD.TDTT, 'YYYY'), TO_CHAR(HD.TDTT, 'MM')`;

    const tkDichVu = await db.executeQuery(sqlQuery);

    res.status(200).json({
      errcode: 0,
      message: "Successful",
      data: tkDichVu,
    });
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({
      errcode: -1,
      message: "Error from server",
      data: [],
    });
  }
};

// GET /thongke/benh
const benh = async (req, res) => {
  try {
    const sqlQuery = `
        SELECT TO_CHAR(P.NGAYKHAM, 'MM') AS month, TO_CHAR(P.NGAYKHAM, 'YYYY') AS year, 
        B.TENBENH AS name, B.MAICD AS id, COUNT(*) AS frequency
        FROM BENH B, CHITIETBENH C, PHIEUKHAM P
        WHERE B.MABENH = C.MABENH
        AND P.MAPK = C.MAPK
        GROUP BY TO_CHAR(P.NGAYKHAM, 'MM'), TO_CHAR(P.NGAYKHAM, 'YYYY'), B.TENBENH, B.MAICD
        ORDER BY TO_CHAR(P.NGAYKHAM, 'YYYY'), TO_CHAR(P.NGAYKHAM, 'MM')`;

    const tkBenh = await db.executeQuery(sqlQuery);

    res.status(200).json({
      errcode: 0,
      message: "Successful",
      data: tkBenh,
    });
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({
      errcode: -1,
      message: "Error from server",
      data: [],
    });
  }
};

// GET /thongke/thuoc
const thuoc = async (req, res) => {
  try {
    const sqlQuery = `
      SELECT TO_CHAR(D.NGAYLAP, 'MM') AS month, TO_CHAR(D.NGAYLAP, 'YYYY') AS year, 
      T.TENTHUOC AS name, T.MATHUOC AS id, SUM(SOLUONGTHUOC) AS frequency
      FROM THUOC T, CTDT C, DONTHUOC D
      WHERE T.MATHUOC = C.MATHUOC
      AND D.MADT = C.MADT
      GROUP BY TO_CHAR(D.NGAYLAP, 'MM'), TO_CHAR(D.NGAYLAP, 'YYYY'), T.TENTHUOC, T.MATHUOC
      ORDER BY TO_CHAR(D.NGAYLAP, 'YYYY'), TO_CHAR(D.NGAYLAP, 'MM')`;

    const tkBenh = await db.executeQuery(sqlQuery);

    res.status(200).json({
      errcode: 0,
      message: "Successful",
      data: tkBenh,
    });
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({
      errcode: -1,
      message: "Error from server",
      data: [],
    });
  }
};

// GET /thongke/chatluong
const doanhThuLuotKhach = async (req, res) => {
  try {
    const sqlQuery = `
        SELECT  TO_CHAR(HD.TDTT, 'MM') AS month, TO_CHAR(HD.TDTT, 'YYYY') AS year, 
        COUNT(*) AS guest, SUM(HD.THANHTIEN) AS bill
        FROM PHIEUKHAM P, HOADON HD
        WHERE P.MAHD = HD.MAHD
        AND HD.TTTT = 'Đã thanh toán'
        GROUP BY TO_CHAR(HD.TDTT, 'MM'), TO_CHAR(HD.TDTT, 'YYYY')
        ORDER BY TO_CHAR(HD.TDTT, 'YYYY'), TO_CHAR(HD.TDTT, 'MM')`;

    const tkDoanhThu = await db.executeQuery(sqlQuery);

    res.status(200).json({
      errcode: 0,
      message: "Successful",
      data: tkDoanhThu,
    });
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({
      errcode: -1,
      message: "Error from server",
      data: [],
    });
  }
};

// GET /thongke/chatluong
const chatLuong = async (req, res) => {
  try {
    const sqlQuery = `
        SELECT 
            'data-' || bn.MABN AS id, bn.HOTEN as NAME,
            COUNT(pk.MAPK) AS x1,
            tinh_khoang_cach_kham_trung_binh(bn.MABN) AS x2,
            TO_CHAR(pk.NGAYKHAM, 'YYYY') AS year
        FROM BENHNHAN bn, PHIEUKHAM pk 
        WHERE bn.MABN = pk.MABN
        GROUP BY bn.MABN, bn.HOTEN, TO_CHAR(pk.NGAYKHAM, 'YYYY')`;

    const tkChatLuong = await db.executeQuery(sqlQuery);

    res.status(200).json({
      errcode: 0,
      message: "Successful",
      data: tkChatLuong,
    });
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({
      errcode: -1,
      message: "Error from server",
      data: [],
    });
  }
};

module.exports = {
  dichVuKham,
  dichVuCLS,
  benh,
  thuoc,
  doanhThuLuotKhach,
  chatLuong,
};
