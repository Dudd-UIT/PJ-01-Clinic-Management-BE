const db = require("../../config/db");

// GET /datlichthuoc/getAll
const getAll = async (req, res) => {
  try {
    const sqlQuery = `
      SELECT G.MACTDT, G.MAGIO, G.THOIGIAN, CT.GHICHU, T.TENTHUOC, T.THANHPHAN
      FROM GIODATLICH G
      JOIN CTDT CT ON CT.MACTDT = G.MACTDT
      JOIN THUOC T ON T.MATHUOC = CT.MATHUOC`;

    const gioList = await db.executeQuery(sqlQuery);

    res.status(200).json({
      errcode: 0,
      message: "Successful",
      data: gioList,
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

// GET /datlichthuoc/getAllGioThuoc/:id
const getAllGioThuoc = async (req, res) => {
  try {
    const sqlQuery = `
      SELECT G.MACTDT, G.MAGIO, G.THOIGIAN, CT.TRANGTHAIDATLICH, CT.GHICHU
      FROM GIODATLICH G
      JOIN CTDT CT ON CT.MACTDT = G.MACTDT 
      WHERE G.MACTDT = ${req.params.id}`;

    const gioList = await db.executeQuery(sqlQuery);

    console.log("gioList: ", gioList);

    res.status(200).json({
      errcode: 0,
      message: "Successful",
      data: gioList,
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

// POST /datlichthuoc/insert
const insert = async (req, res) => {
  const { maCTDT, thoiGian } = req.body;

  try {
    const sqlQuery = ` 
    BEGIN
        INSERT_GIODATLICH(:PAR_MACTDT, :PAR_THOIGIAN);
    END;`;
    const bindVars = {
      PAR_MACTDT: maCTDT,
      PAR_THOIGIAN: thoiGian,
    };

    const result = await db.executeProcedure(sqlQuery, bindVars);

    res.status(200).json({
      errcode: 0,
      message: "Thêm giờ uống thuốc thành công",
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

// POST /datlichthuoc/update
const update = async (req, res) => {
  console.log();
  try {
    const data = req.body;
    const MACTDT = data[0].MACTDT;

    const sqlQuery = `DELETE FROM GIODATLICH WHERE MACTDT = '${MACTDT}'`;
    await db.executeQuery(sqlQuery);

    for (const item of data) {
      const { MACTDT, THOIGIAN } = item;
      const sqlQuery = ` 
      BEGIN
        INSERT_GIODATLICH(:PAR_MACTDT, :PAR_THOIGIAN);
      END;`;
      const bindVars = {
        PAR_MACTDT: MACTDT,
        PAR_THOIGIAN: THOIGIAN,
      };

      await db.executeProcedure(sqlQuery, bindVars);
    }

    res.status(200).json({
      errcode: 0,
      message: "Cập nhật lịch uống thuốc thành công",
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

// POST /dvt/delete
const deleteLichThuoc = async (req, res) => {
  const { maGio } = req.body;

  try {
    const sqlQuery = ` 
        BEGIN
          DELETE_GIODATLICH(:PAR_MAGIO);
        END;`;
    const bindVars = {
      PAR_MAGIO: maGio,
    };

    const result = await db.executeProcedure(sqlQuery, bindVars);

    res.status(200).json({
      errcode: 0,
      message: "Xóa giờ đặt lịch thuốc thành công",
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
  getAllGioThuoc,
  insert,
  update,
  deleteLichThuoc,
};
