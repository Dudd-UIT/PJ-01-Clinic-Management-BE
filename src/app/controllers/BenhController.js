const { handleUserLogin } = require("../../services/UserService");
const db = require("../../config/db");

// GET /benh/getAll
const getAll = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM BENH WHERE TRANGTHAI = 1`;

    const benh = await db.executeQuery(sqlQuery);

    res.status(200).json({
      errcode: 0,
      message: "Successful",
      data: benh,
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

// POST /benh/insert
const insert = async (req, res) => {
  const { maICD, tenBenh } = req.body;

  try {
    const sqlQuery = ` 
    BEGIN
        INSERT_BENH(:PAR_MAICD, :PAR_TENBENH);
    END;`;
    const bindVars = {
      PAR_MAICD: maICD,
      PAR_TENBENH: tenBenh,
    };

    const result = await db.executeProcedure(sqlQuery, bindVars);

    res.status(200).json({
      errcode: 0,
      message: "Thêm bệnh thành công",
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

// POST /benh/update
const update = async (req, res) => {
  const { maBenh, maICD, tenBenh } = req.body;

  try {
    const sqlQuery = ` 
        BEGIN
          UPDATE_BENH(:PAR_MABENH, :PAR_MAICD, :PAR_TENBENH);
        END;`;
    const bindVars = {
      PAR_MABENH: maBenh,
      PAR_MAICD: maICD,
      PAR_TENBENH: tenBenh,
    };

    const result = await db.executeProcedure(sqlQuery, bindVars);

    res.status(200).json({
      errcode: 0,
      message: "Cập nhật bệnh thành công",
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

// POST /benh/delete
const deleteBenh = async (req, res) => {
  const { maBenh } = req.body;

  try {
    const sqlQuery = ` 
        BEGIN
          DELETE_BENH(:PAR_MABENH);
        END;`;
    const bindVars = {
      PAR_MABENH: maBenh,
    };

    const result = await db.executeProcedure(sqlQuery, bindVars);

    res.status(200).json({
      errcode: 0,
      message: "Xóa bệnh thành công",
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
  deleteBenh
};
