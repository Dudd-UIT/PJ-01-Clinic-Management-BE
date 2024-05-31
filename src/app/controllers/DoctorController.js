const db = require("../../config/db");
const oracledb = require("oracledb");

class DoctorController {
  // GET /bacsi/getAll
  async getAll(req, res) {
    try {
      const sqlQuery = "SELECT * FROM BACSI";
      const doctors = await db.executeQuery(sqlQuery);

      const formattedDoctors = doctors.map((doctor) => {
        doctor.NGAYSINH = new Date(doctor.NGAYSINH);
        const INFOBSTH = "BS " + doctor.TRINHDO + " " + doctor.HOTEN;
        return { ...doctor, INFOBSTH };
      });

      res.status(200).json({
        errcode: 0,
        message: "Successful",
        data: formattedDoctors,
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

  // POST /bacsi/getByDate/:date
  async getByDate(req, res) {
    const date = req.body.date;
    console.log("date", date);
    try {
      const [dayOfWeek, dateMonthYear] = date.split(", ");
      console.log(dayOfWeek);
      console.log(dateMonthYear);
      const sqlQuery = `
      SELECT B.MABS, B.HOTEN, B.TRINHDO, B.GIOITINH, B.CHUYENKHOA, B.SDT, P.GIOBATDAU, P.GIOKETTHUC, PK.GIODATLICH
      FROM BACSI B
      JOIN PHANCONGKHAM P ON B.MABS = P.MABS
      LEFT JOIN PHIEUKHAM PK ON B.MABS = PK.MABSC 
      AND TRUNC(NGAYKHAM) = TRUNC(TO_DATE('${dateMonthYear}', 'DD/MM/YYYY'))
      WHERE P.THU = '${dayOfWeek}'`;
      const doctors = await db.executeQuery(sqlQuery);
      // const formattedDoctors = doctors.map((doctor) => {
      //   doctor.NGAYSINH = new Date(doctor.NGAYSINH);
      //   const INFOBSTH = "BS " + doctor.TRINHDO + " " + doctor.HOTEN;
      //   return { ...doctor, INFOBSTH };
      // });

      function getAvailableHours(doctors) {
        const hourToMinutes = (hour) => {
          const [h, m] = hour.split(":").map(Number);
          return h * 60 + m;
        };

        const minutesToHour = (minutes) => {
          const h = String(Math.floor(minutes / 60)).padStart(2, "0");
          const m = String(minutes % 60).padStart(2, "0");
          return `${h}:${m}`;
        };

        const oneHourInMinutes = 60;

        const doctorHoursMap = {};

        doctors.forEach((doctor) => {
          const {
            MABS,
            HOTEN,
            TRINHDO,
            GIOITINH,
            CHUYENKHOA,
            GIOBATDAU,
            GIOKETTHUC,
            GIODATLICH,
          } = doctor;
          if (!doctorHoursMap[MABS]) {
            doctorHoursMap[MABS] = {
              MABS,
              HOTEN,
              TRINHDO,
              GIOITINH,
              CHUYENKHOA,
              GIOLAMVIEC: [],
              GIODADAT: [],
            };
          }
          if (GIODATLICH) {
            doctorHoursMap[MABS].GIODADAT.push(GIODATLICH);
          }
        });

        const result = Object.values(doctorHoursMap).map((doctor) => {
          const { GIOBATDAU, GIOKETTHUC } = doctors.find(
            (d) => d.MABS === doctor.MABS
          );
          const startMinutes = hourToMinutes(GIOBATDAU);
          const endMinutes = hourToMinutes(GIOKETTHUC);
          const bookedHours = doctor.GIODADAT.map(hourToMinutes);

          for (
            let time = startMinutes;
            time < endMinutes;
            time += oneHourInMinutes
          ) {
            doctor.GIOLAMVIEC.push(minutesToHour(time));
          }

          return doctor;
        });

        return result;
      }

      const gioTrong = getAvailableHours(doctors);
      console.log(gioTrong);

      res.status(200).json({
        errcode: 0,
        message: "Successful",
        data: gioTrong,
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
}

module.exports = new DoctorController();
