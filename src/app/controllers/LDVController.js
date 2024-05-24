const db = require("../../config/db");

// POST /ldv/insert
const insert = async (req, res) => {
  const { tenLDV } = req.body;

  try {
    const sqlQuery = ` 
    BEGIN
        INSERT_LOAIDICHVU(:PAR_TENLOAIDV);
    END;`;
    const bindVars = {
      PAR_TENLOAIDV: tenLDV,
    };

    const result = await db.executeProcedure(sqlQuery, bindVars);

    res.status(200).json({
      errcode: 0,
      message: "Thêm loại dịch vụ thành công",
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

// POST /ldv/update
const update = async (req, res) => {
  const { maLDV, tenLDV } = req.body;

  try {
    const sqlQuery = ` 
        BEGIN
            UPDATE_LOAIDICHVU(:PAR_MALOAIDV, :PAR_TENLOAIDV);
        END;`;
    const bindVars = {
      PAR_MALOAIDV: maLDV,
      PAR_TENLOAIDV: tenLDV,
    };

    const result = await db.executeProcedure(sqlQuery, bindVars);

    res.status(200).json({
      errcode: 0,
      message: "Cập nhật loại dịch vụ thành công",
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

// POST /ldv/delete
const deleteLDV = async (req, res) => {
  const { maLDV } = req.body;
  console.log('maLDV', maLDV)

  try {
    const sqlQuery = ` 
        BEGIN
          DELETE_LOAIDICHVU(:PAR_MALOAIDV);
        END;`;
    const bindVars = {
      PAR_MALOAIDV: maLDV,
    };

    const result = await db.executeProcedure(sqlQuery, bindVars);

    res.status(200).json({
      errcode: 0,
      message: "Xóa loại dịch vụ thành công",
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
  deleteLDV,
};
