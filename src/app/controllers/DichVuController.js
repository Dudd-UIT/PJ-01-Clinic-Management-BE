const { Int } = require("msnodesqlv8");
const db = require("../../config/db");

class DichVuController {
  // GET /dichvu/getAll
  async getAll(req, res) {
    try {
      const sqlQuery = `SELECT MADV, D.MALOAIDV, TENDV, GIADV, TENLOAIDV 
          FROM DICHVU D, LOAIDV L 
          WHERE L.MALOAIDV = D.MALOAIDV
          AND D.TRANGTHAI = 1`;
      const dichvus = await db.executeQuery(sqlQuery);
      setTimeout(
        () =>
          res.status(200).json({
            errcode: 0,
            message: "Successful",
            data: dichvus,
          }),
        1000
      );
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({
        errcode: -1,
        message: "Error from server",
        data: [],
      });
    }
  }

  // GET /dichvu/getAllLDV
  async getAllLDV(req, res) {
    try {
      const sqlQuery = "SELECT * FROM LOAIDV WHERE TRANGTHAI = 1";
      const loaiDichVu = await db.executeQuery(sqlQuery);

      res.status(200).json({
        errcode: 0,
        message: "Successful",
        data: loaiDichVu,
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

  // POST /dichvu/insert
  insert = async (req, res) => {
    const { tenDichVu, maLDV, giaDichVu } = req.body;

    try {
      const sqlQuery = ` 
      BEGIN
          INSERT_DICHVU(:PAR_MALOAIDV, :PAR_TENDV, :PAR_GIADV);
      END;`;
      const bindVars = {
        PAR_MALOAIDV: maLDV,
        PAR_TENDV: tenDichVu,
        PAR_GIADV: giaDichVu,
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      res.status(200).json({
        errcode: 0,
        message: "Thêm dịch vụ thành công",
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

  // POST /dichvu/update
  update = async (req, res) => {
    const { maDV, maLDV, tenDichVu, giaDichVu } = req.body;

    try {
      const sqlQuery = ` 
        BEGIN
          UPDATE_DICHVU(:PAR_MADV, :PAR_MALOAIDV, :PAR_TENDV, :PAR_GIADV);
        END;`;
      const bindVars = {
        PAR_MADV: maDV,
        PAR_MALOAIDV: maLDV,
        PAR_TENDV: tenDichVu,
        PAR_GIADV: giaDichVu,
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      res.status(200).json({
        errcode: 0,
        message: "Cập nhật dịch vụ thành công",
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

  // POST /dichvu/delete
  deleteDichVu = async (req, res) => {
    const { maDV } = req.body;

    try {
      const sqlQuery = ` 
          BEGIN
            DELETE_DICHVU(:PAR_MADV);
          END;`;
      const bindVars = {
        PAR_MADV: maDV,
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      res.status(200).json({
        errcode: 0,
        message: "Xóa dịch vụ thành công",
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

module.exports = new DichVuController();
