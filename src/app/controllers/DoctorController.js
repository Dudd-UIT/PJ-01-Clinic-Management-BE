const db = require("../../config/db");
const oracledb = require("oracledb");

class DoctorController {
  // GET /doctor/
  async index(req, res) {
    try {
      const sqlQuery = "SELECT * FROM BACSI";
      const doctors = await db.executeQuery(sqlQuery);

      const formattedDoctors = doctors.map((doctor) => {
        const [
          mabs,
          matk,
          cccd,
          hoTen,
          trinhDo,
          gioiTinh,
          sdt,
          ngaySinh,
          diaChi,
          chuyenKhoa,
        ] = doctor;

        const formattedNgaySinh = new Date(ngaySinh);

        return [
          mabs,
          matk,
          cccd,
          hoTen,
          trinhDo,
          gioiTinh,
          sdt,
          formattedNgaySinh,
          diaChi,
          chuyenKhoa,
        ];
      });
      console.log(formattedDoctors);
      setTimeout(() => res.send(formattedDoctors), 1000);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new DoctorController();
