const db = require("../../config/db");

class ThuocController {
  // GET /thuoc/keDon/getAll
  async fetchAllThuoc(req, res) {
    try {
      const sqlQuery = `
      SELECT th.MATHUOC, TENTHUOC, THANHPHAN, TENDONVI, GIABAN, SUM(SOLUONGTON) AS SOLUONGTON
      FROM THUOC th
      INNER JOIN DONVITHUOC dvt ON th.MADVT = dvt.MADVT
      INNER JOIN LOTHUOC loth ON th.MATHUOC = loth.MATHUOC
      WHERE th.TRANGTHAI = 1
      AND loth.TRANGTHAI = 1
      AND loth.HANSD > TRUNC(CURRENT_DATE)
      GROUP BY th.MATHUOC, TENTHUOC, THANHPHAN, TENDONVI, GIABAN
      HAVING SUM(SOLUONGTON) > 0`;

      const thuocList = await db.executeQuery(sqlQuery);

      res.status(200).send({
        errcode: 0,
        message: "Successful",
        data: thuocList,
      });
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({
        errcode: -1,
        message: "Internal Server Error",
      });
    }
  }

  // GET /thuoc/getAll
  async getAll(req, res) {
    try {
      const sqlQuery = `SELECT T.MATHUOC, D.TENDONVI, D.MADVT, T.TENTHUOC, T.THANHPHAN
                        FROM THUOC T, DONVITHUOC D 
                        WHERE T.MADVT = D.MADVT
                        AND T.TRANGTHAI = 1`;
                    
      const thuoc = await db.executeQuery(sqlQuery);
  
      res.status(200).json({
        errcode: 0,
        message: "Successful",
        data: thuoc,
      });
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({
        errcode: -1,
        message: "Error from server",
        data: [],
      });
    }
  }

  // POST /thuoc/insert
  insert = async (req, res) => {
    const { maDVT, tenThuoc, thanhPhan } = req.body;

    try {
      const sqlQuery = ` 
      BEGIN
        INSERT_THUOC(:PAR_TENTHUOC, :PAR_DVT, :PAR_THANHPHAN);
      END;`;
      const bindVars = {
        PAR_TENTHUOC: tenThuoc,
        PAR_DVT: maDVT,
        PAR_THANHPHAN: thanhPhan,
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      res.status(200).json({
        errcode: 0,
        message: "Thêm thuốc thành công",
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

  // POST /thuoc/update
  update = async (req, res) => {
    const { maThuoc, maDVT, tenThuoc, thanhPhan } = req.body;

    try {
      const sqlQuery = ` 
        BEGIN
          UPDATE_THUOC(:PAR_MATHUOC, :PAR_TENTHUOC, :PAR_DVT, :PAR_THANHPHAN);
        END;`;
      const bindVars = {
        PAR_MATHUOC: maThuoc,
        PAR_TENTHUOC: tenThuoc,
        PAR_DVT: maDVT,
        PAR_THANHPHAN: thanhPhan,
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      res.status(200).json({
        errcode: 0,
        message: "Cập nhật thuốc thành công",
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

  // POST /thuoc/delete
  deleteThuoc = async (req, res) => {
    const { maThuoc } = req.body;

    try {
      const sqlQuery = ` 
          BEGIN
            DELETE_THUOC(:PAR_MATHUOC);
          END;`;
      const bindVars = {
        PAR_MATHUOC: maThuoc,
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      res.status(200).json({
        errcode: 0,
        message: "Xóa thuốc thành công",
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
}

module.exports = new ThuocController();
