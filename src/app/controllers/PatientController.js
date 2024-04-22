const db = require("../../config/db");
const oracledb = require("oracledb");
const { format } = require("date-fns");

class PatientController {
  // GET /patient/
  async index(req, res) { 
    try {
      const sqlQuery = "SELECT * FROM BENHNHAN";
      const patients = await db.executeQuery(sqlQuery);

      const formattedPatients = patients.map((patient) => {
        const [
          mabn,
          matk,
          cccd,
          hoTen,
          ngaySinh,
          gioiTinh,
          sdt,
          diaChi,
          tienSuBenh,
          diUng,
        ] = patient;

        const formattedNgaySinh = new Date(ngaySinh);

        return [
          mabn,
          matk,
          cccd,
          hoTen,
          formattedNgaySinh,
          gioiTinh,
          sdt,
          diaChi,
          tienSuBenh,
          diUng,
        ];
      });

      setTimeout(() => res.send(formattedPatients), 1000);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // POST /patient/store
  async store(req, res) {
    const {
      hoTen,
      gioiTinh,
      diaChi,
      ngaySinh,
      cccd,
      soDienThoai,
      diUng,
      chuThich,
      ...others
    } = req.body;
    console.log(
      hoTen,
      gioiTinh,
      diaChi,
      ngaySinh,
      cccd,
      soDienThoai,
      diUng,
      chuThich
    );
    try {
      const formattedNgaySinh = new Date(ngaySinh);

      const sqlQuery = `
                BEGIN
                    INSERT_BENHNHAN(:p_cccd, :p_hoten, :p_ngaysinh, :p_gioitinh, :p_sdt, :p_diachi, :p_tiensubenh, :p_diung);
                END;`;

      const bindVars = {
        p_cccd: cccd,
        p_hoten: hoTen,
        p_ngaysinh: formattedNgaySinh,
        p_gioitinh: gioiTinh,
        p_sdt: soDienThoai,
        p_diachi: diaChi,
        p_tiensubenh: chuThich,
        p_diung: diUng,
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);
      console.log(result);
      // Xử lý kết quả trả về
      res.status(200).json({ message: "Data BENHNHAN inserted successfully" });
    } catch (error) {
      console.error("Error calling procedure:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }

    // try {
    //     const formattedNgaySinh = new Date(ngaySinh);

    //     const sqlQuery = `
    //         BEGIN
    //             INSERT_PHIEUKHAM(:p_cccd, :p_hoten, :p_ngaysinh, :p_gioitinh, :p_sdt, :p_diachi, :p_tiensubenh, :p_diung);
    //         END;`;

    //     const bindVars = {
    //         p_cccd: cccd,
    //         p_hoten: hoTen,
    //         p_ngaysinh: formattedNgaySinh,
    //         p_gioitinh: gioiTinh,
    //         p_sdt: soDienThoai,
    //         p_diachi: diaChi,
    //         p_tiensubenh: chuThich,
    //         p_diung: diUng,
    //     };

    //     const result = await db.executeProcedure(sqlQuery, bindVars);
    //     console.log(result)
    //     // Xử lý kết quả trả về
    //     res.status(200).json({ message: "Data PHIEUKHAM inserted successfully" });
    // } catch (error) {
    //     console.error('Error calling procedure:', error);
    //     res.status(500).json({ error: 'Internal Server Error' });
    // }
  }
}

module.exports = new PatientController();
