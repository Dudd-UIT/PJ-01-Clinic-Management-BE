const db = require("../../config/db"); // Import your database module
const oracledb = require("oracledb");
const {formatDate} = require("../../util/formatDate")

class SiteController {
  // GET /
  async index(req, res, next) {
    const customerId = req.params.customerId;

    try {
      const sqlQuery = 'SELECT Tong_Doanhso(:P_MAKH) AS TOTAL_REVENUE FROM DUAL';
      const bindVars = {
        P_MAKH: 201
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);
      console.log(result)
      console.log(result.length)
      if (result) {
        const totalRevenue = result.rows;
        console.log(totalRevenue[0][0])
        res.json({ totalRevenue });
      } else {
        res.status(404).json({ error: 'Customer not found or no revenue data' });
      }
    } catch (error) {
      console.error('Error calling function:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // GET /search
  async search(req, res) {
    try {
      const procedureName = "BEGIN UPDATESALARY(:P_MA); END;";
      const bindVars = {
        P_MA: 6,
      };

      const result = await db.executeProcedure(procedureName, bindVars);
      console.log(result)
      if (result && result.returnValue === 0) {
        console.log("SALARY UPDATED");
      } else {
        console.log("SALARY NOT UPDATED");
      }
    } catch (error) {
      console.error("Error calling stored procedure:", error);
    }
  }


  // GET /tiepdon
  async tiepdon(req, res) {
    try {
      const sqlQuery = "SELECT * FROM BENHNHAN";
      const customers = await db.executeQuery(sqlQuery);
  
      const formattedCustomers = customers.map(customer => {
        const [mabn, matk, cccd, hoTen, ngaySinh, gioiTinh, sdt, diaChi, tienSuBenh, diUng] = customer;
  
        const formattedNgaySinh = formatDate(ngaySinh);
  
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
          diUng
        ];
      });
  
      setTimeout(() => res.send(formattedCustomers), 1000);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  
}

module.exports = new SiteController();
