const { handleUserLogin } = require("../../services/UserService");
const db = require("../../config/db");

// GET /role/getAll
const getAll = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM VAITRO`;

    const roles = await db.executeQuery(sqlQuery);

    res.status(200).json({
      errcode: 0,
      message: "Successful",
      data: roles,
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

// POST /role/getById
const getById = async (req, res) => {
  const { selectedVaiTro } = req.body;
  try {
    const sqlQuery = `SELECT * FROM NHOM_VAITRO WHERE MANHOM = '${selectedVaiTro}'`;

    const roles = await db.executeQuery(sqlQuery);

    res.status(200).json({
      errcode: 0,
      message: "Successful",
      data: roles,
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

// POST /role/insert
const insert = async (req, res) => {
  const { url, moTa } = req.body;

  try {
    const sqlQuery = ` 
    BEGIN
      INSERT_VAITRO_NHOM_VAITRO(:PAR_URL, :PAR_MOTA);
    END;`;
    const bindVars = {
        PAR_URL: url,
        PAR_MOTA: moTa,
    };

    const result = await db.executeProcedure(sqlQuery, bindVars);

    res.status(200).json({
      errcode: 0,
      message: "Thêm quyền mới thành công",
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

// POST /role/assignRoleToGroup
const assignRoleToGroup = async (req, res) => {
  try {
    const data = req.body;
    const MANHOM = data[0].MANHOM;

    const sqlQuery = `DELETE FROM NHOM_VAITRO WHERE MANHOM = '${MANHOM}'`;
    await db.executeQuery(sqlQuery);
    
    for (const item of data) {
      const { MANHOM, MAVAITRO } = item;
      const sqlQuery = ` 
        BEGIN
          INSERT_NHOM_VAITRO(:PAR_MANHOM, :PAR_MAVAITRO);
        END;`;
      const bindVars = {
        PAR_MANHOM: MANHOM,
        PAR_MAVAITRO: MAVAITRO,
      };

      await db.executeProcedure(sqlQuery, bindVars);
    }

    res.status(200).json({
      errcode: 0,
      message: "Gán quyền thành công",
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

// POST /role/update
const update = async (req, res) => {
  const { maVaiTro, url, moTa } = req.body;

  try {
    const sqlQuery = ` 
        BEGIN
            UPDATE_VAITRO(:PAR_MAVAITRO, :PAR_URL, :PAR_MOTA);
        END;`;
    const bindVars = {
        PAR_MAVAITRO: maVaiTro,
        PAR_URL: url,
        PAR_MOTA: moTa,
    };

    const result = await db.executeProcedure(sqlQuery, bindVars);

    res.status(200).json({
      errcode: 0,
      message: "Cập nhật quyền thành công",
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

// POST /role/delete
const deleteRole = async (req, res) => {
    const { maVaiTro } = req.body;
  
    try {
      const sqlQuery = ` 
          BEGIN
            DELETE_VAITRO(:PAR_MAVAITRO);
          END;`;
      const bindVars = {
          PAR_MAVAITRO: maVaiTro
      };
  
      const result = await db.executeProcedure(sqlQuery, bindVars);
  
      res.status(200).json({
        errcode: 0,
        message: "Xóa quyền thành công",
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
  getById,
  insert,
  update,
  assignRoleToGroup,
  deleteRole
};
