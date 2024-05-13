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
      res.status(200).send({
        errcode: 0,
        message: "Successful",
        data: formattedPatients,
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
    console.log(req.body);
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

    const formattedNgaySinh = new Date(ngaySinh);
    console.log("Insert: ", formattedNgaySinh);

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

  // POST /benhnhan/update
  async update(req, res) {
    const {
      maBN,
      CCCD,
      tenBN,
      gioiTinh,
      diaChi,
      ngaySinh,
      soDienThoai,
      diUng,
      tienSuBenh,
    } = req.body;
    const formattedNgaySinh = new Date(ngaySinh);

    try {
      const sqlQuery = `
                BEGIN
                    UPDATE_BENHNHAN(:par_Mabn, :par_cccd, :par_HoTen, :par_NgaySinh, :par_GioiTinh, :par_sdt, :par_DiaChi, :par_TienSuBenh, :par_DiUng);
                END;`;

      const bindVars = {
        par_Mabn: maBN,
        par_cccd: CCCD,
        par_HoTen: tenBN,
        par_NgaySinh: formattedNgaySinh,
        par_GioiTinh: gioiTinh,
        par_sdt: soDienThoai,
        par_DiaChi: diaChi,
        par_TienSuBenh: tienSuBenh,
        par_DiUng: diUng,
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      // Xử lý kết quả trả về
      res.status(200).json({
        errcode: 0,
        message: "Cập nhật thông tin khách hàng thành công",
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
