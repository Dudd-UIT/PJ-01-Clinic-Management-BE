const db = require("../../config/db");
const oracledb = require("oracledb");
const { format } = require('date-fns');

class CustomerController {

    // GET /customer/
    index(req, res) {
        res.send('CUSTOMER');
    }

    // POST /customer/store
    async store(req, res) {
        const { hoTen, gioiTinh, diaChi, ngaySinh, cccd, soDienThoai, diUng, chuThich, ...others } = req.body;
        console.log(hoTen, gioiTinh, diaChi, ngaySinh, cccd, soDienThoai, diUng, chuThich)
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
            console.log(result)
            // Xử lý kết quả trả về
            res.status(200).json({ message: "Data inserted successfully" });
        } catch (error) {
            console.error('Error calling procedure:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new CustomerController();
