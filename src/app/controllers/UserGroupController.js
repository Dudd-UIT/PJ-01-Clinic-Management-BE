const db = require("../../config/db");

// POST /usergroup/insert
const insert = async (req, res) => {
  const { tenNhom } = req.body;

  try {
    const sqlQuery = ` 
    BEGIN
        INSERT_NHOM(:PAR_TENNHOM);
    END;`;
    const bindVars = {
      PAR_TENNHOM: tenNhom,
    };

    const result = await db.executeProcedure(sqlQuery, bindVars);

    res.status(200).json({
      errcode: 0,
      message: "Thêm nhóm người dùng thành công",
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

// POST /usergroup/update
const update = async (req, res) => {
  const { maNhom, tenNhom } = req.body;

  try {
    const sqlQuery = ` 
        BEGIN
            UPDATE_NHOM(:PAR_MANHOM, :PAR_TENNHOM);
        END;`;
    const bindVars = {
        PAR_MANHOM: maNhom,
        PAR_TENNHOM: tenNhom,
    };

    const result = await db.executeProcedure(sqlQuery, bindVars);

    res.status(200).json({
      errcode: 0,
      message: "Cập nhật nhóm người dùng thành công",
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

// POST /usergroup/delete
const deleteUserGroup = async (req, res) => {
  const { maNhom } = req.body;
  console.log("maNhom", maNhom);

  try {
    const sqlQuery = ` 
        BEGIN
            DELETE_NHOM(:PAR_MANHOM);
        END;`;
    const bindVars = {
        PAR_MANHOM: maNhom,
    };

    const result = await db.executeProcedure(sqlQuery, bindVars);

    res.status(200).json({
      errcode: 0,
      message: "Xóa nhóm người dùng thành công",
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
  insert,
  update,
  deleteUserGroup,
};
