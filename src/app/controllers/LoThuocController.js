const { handleUserLogin } = require("../../services/UserService");
const db = require("../../config/db");

// GET /lothuoc/getAll
const getAll = async (req, res) => {
  try {
    const sqlQuery = `SELECT MALOTHUOC, L.MATHUOC, TENTHUOC, NHACC, SOLUONGTON, HANSD, GIANHAP, GIABAN, NGAYNHAP
                        FROM LOTHUOC L, THUOC T
                        WHERE L.MATHUOC = T.MATHUOC
                        AND TRANGTHAI = 1`;

    const loThuoc = await db.executeQuery(sqlQuery);

    res.status(200).json({
      errcode: 0,
      message: "Successful",
      data: loThuoc,
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

// POST /lothuoc/insert
const insert = async (req, res) => {
  const { maThuoc, nhaCC, hanSD, soLuongNhap, giaNhap, giaBan, ngayNhap } = req.body;

  try {
    const sqlQuery = ` 
    BEGIN
        INSERT_LOTHUOC(:PAR_MATHUOC, :PAR_NHACC, :PAR_HANSD, :PAR_SOLUONGNHAP, :PAR_GIANHAP, :PAR_GIABAN, :PAR_NGAYNHAP);
    END;`;
    const bindVars = {
        PAR_MATHUOC: maThuoc,
        PAR_NHACC: nhaCC,
        PAR_HANSD: hanSD,
        PAR_SOLUONGNHAP: soLuongNhap,
        PAR_GIANHAP: giaNhap,
        PAR_GIABAN: giaBan,
        PAR_NGAYNHAP: ngayNhap,
    };

    const result = await db.executeProcedure(sqlQuery, bindVars);

    res.status(200).json({
      errcode: 0,
      message: "Thêm lô thuốc thành công",
      data: "",
    });
  } catch (error) {
    console.error("Error calling procedure:", error);
    res.status(500).json({
      errcode: -1,
      message: "Lỗi ở server",
      data: "",
    });
  }
};

// POST /lothuoc/update
const update = async (req, res) => {
  const { maLoThuoc, nhaCC, giaNhap, giaBan, ngayNhap } = req.body;

  try {
    const sqlQuery = ` 
        BEGIN
          UPDATE_LOTHUOC(:PAR_MALOTHUOC , :PAR_NHACC, :PAR_GIANHAP, :PAR_GIABAN, :PAR_NGAYNHAP);
        END;`;
    const bindVars = {
      PAR_MALOTHUOC: maLoThuoc,
      PAR_NHACC: nhaCC,
      PAR_GIANHAP: giaNhap,
      PAR_GIABAN: giaBan,
      PAR_NGAYNHAP: ngayNhap,
    };

    const result = await db.executeProcedure(sqlQuery, bindVars);

    res.status(200).json({
      errcode: 0,
      message: "Cập nhật lô thuốc thành công",
      data: "",
    });
  } catch (error) {
    console.error("Error calling procedure:", error);
    res.status(500).json({
      errcode: -1,
      message: "Lỗi ở server",
      data: "",
    });
  }
};

// POST /lothuoc/delete
const deleteLoThuoc = async (req, res) => {
  const { maLoThuoc } = req.body;

  try {
    const sqlQuery = ` 
        BEGIN
          DELETE_LOTHUOC(:PAR_MALOTHUOC);
        END;`;
    const bindVars = {
      PAR_MALOTHUOC: maLoThuoc,
    };

    const result = await db.executeProcedure(sqlQuery, bindVars);

    res.status(200).json({
      errcode: 0,
      message: "Xóa lô thuốc thành công",
      data: "",
    });
  } catch (error) {
    console.error("Error calling procedure:", error);
    res.status(500).json({
      errcode: -1,
      message: "Lỗi ở server",
      data: "",
    });
  }
};

module.exports = {
  getAll,
  insert,
  update,
  deleteLoThuoc,
};
