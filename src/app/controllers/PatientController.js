const db = require("../../config/db");
const oracledb = require("oracledb");
const { format } = require("date-fns");
const { DateTime2 } = require("mssql");

class PatientController {
  // GET /benhnhan/getAll
  async getAll(req, res) {
    try {
      const sqlQuery = "SELECT * FROM BENHNHAN";
      const patients = await db.executeQuery(sqlQuery);
      const formattedPatients = patients.map((patient) => {
        patient.NGAYSINH = new Date(patient.NGAYSINH);
        return patient;
      });

      setTimeout(
        () =>
          res.status(200).send({
            errcode: 0,
            message: "Successful",
            data: formattedPatients,
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

  // GET /benhnhan/getById/:id
  async getByID(req, res) {
    try {
      const sqlQuery = `SELECT MABN, MATK, CCCD, HOTEN, NGAYSINH, GIOITINH, SDT, DIACHI, TIENSUBENH, DIUNG 
      FROM BENHNHAN WHERE MABN = ${req.params.id}`;
      const patients = await db.executeQuery(sqlQuery);

      if (patients.length === 0) {
        res.status(200).json({
          errcode: 1,
          message: "No data found: invalid MABN",
          data: patients,
        });
        return;
      }

      const selectedPatient = patients[0];
      selectedPatient.NGAYSINH = new Date(selectedPatient.NGAYSINH);

      res.status(200).send({
        errcode: 0,
        message: "Successful",
        data: selectedPatient,
      });
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({
        errcode: -1,
        message: "Lỗi ở server",
      });
    }
  }

  // POST /benhnhan/insert
  async store(req, res) {
    const {
      hoTen,
      gioiTinh,
      diaChi,
      ngaySinh,
      cccd,
      soDienThoai,
      diUng,
      tienSuBenh,
      ...others
    } = req.body;

    try {
      const formattedNgaySinh = new Date(ngaySinh);

      const sqlQuery = `
                BEGIN
                    INSERT_BENHNHAN(:p_cccd, :p_hoten, :p_ngaysinh, :p_gioitinh, :p_sdt, :p_diachi, :p_tiensubenh, :p_diung, :out_mabn);
                END;`;

      const bindVars = {
        p_cccd: cccd,
        p_hoten: hoTen,
        p_ngaysinh: formattedNgaySinh,
        p_gioitinh: gioiTinh,
        p_sdt: soDienThoai,
        p_diachi: diaChi,
        p_tiensubenh: tienSuBenh,
        p_diung: diUng,
        out_mabn: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      // Xử lý kết quả trả về
      res.status(200).json({
        errcode: 0,
        message: "Thêm bệnh nhân mới thành công",
        MABN: result.outBinds.out_mabn,
      });
    } catch (error) {
      res.status(500).json({
        errcode: -1,
        message: "Lỗi ở server",
      });
    }
  }
}

module.exports = new PatientController();
