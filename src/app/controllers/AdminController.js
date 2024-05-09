const { handleUserLogin } = require("../../services/UserService");
const db = require("../../config/db");
const oracledb = require("oracledb");

// GET /admin/getThamSo
const getThamSo = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM THAMSO`;

    const parameters = await db.executeQuery(sqlQuery);

    res.status(200).json({
      errcode: 0,
      message: "Successful",
      data: parameters,
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

// POST /admin/updateThamSo
const updateThamSo = async (req, res) => {
    const { tenThamSo, giaTri } = req.body;
  
    try {
      const sqlQuery = ` 
          BEGIN
            UPDATE_THAMSO(:PAR_TENTHAMSO, :PAR_GIATRI);
          END;`;
      const bindVars = {
        PAR_TENTHAMSO: tenThamSo,
        PAR_GIATRI: giaTri,
      };
  
      const result = await db.executeProcedure(sqlQuery, bindVars);
  
      res.status(200).json({
        errcode: 0,
        message: "Cập nhật giá trị tham số thành công",
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
  getThamSo,
  updateThamSo
};
