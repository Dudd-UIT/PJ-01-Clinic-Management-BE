const { handleUserLogin } = require("../../services/UserService");
const db = require("../../config/db");

// GET /dvt/getAll
const getAll = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM DONVITHUOC WHERE TRANGTHAI = 1`;

    const DVT = await db.executeQuery(sqlQuery);

    res.status(200).json({
      errcode: 0,
      message: "Successful",
      data: DVT,
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

// POST /dvt/insert
const insert = async (req, res) => {
  const { tenDVT } = req.body;

  try {
    const sqlQuery = ` 
    BEGIN
        INSERT_DONVITHUOC(:PAR_TENDONVI);
    END;`;
    const bindVars = {
      PAR_TENDONVI: tenDVT,
    };

    const result = await db.executeProcedure(sqlQuery, bindVars);

    res.status(200).json({
      errcode: 0,
      message: "Thêm đơn vị thuốc thành công",
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

// POST /dvt/update
const update = async (req, res) => {
  const { maDVT, tenDVT } = req.body;

  try {
    const sqlQuery = ` 
        BEGIN
            UPDATE_DONVITHUOC(:PAR_MADVT, :PAR_TENDONVI);
        END;`;
    const bindVars = {
      PAR_MADVT: maDVT,
      PAR_TENDONVI: tenDVT,
    };

    const result = await db.executeProcedure(sqlQuery, bindVars);

    res.status(200).json({
      errcode: 0,
      message: "Cập nhật đơn vị thuốc thành công",
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
const deleteDVT = async (req, res) => {
  const { maDVT } = req.body;

  try {
    const sqlQuery = ` 
        BEGIN
          DELETE_DONVITHUOC(:PAR_MADVT);
        END;`;
    const bindVars = {
      PAR_MADVT: maDVT,
    };

    const result = await db.executeProcedure(sqlQuery, bindVars);

    res.status(200).json({
      errcode: 0,
      message: "Xóa đơn vị thuốc thành công",
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
  deleteDVT
};
