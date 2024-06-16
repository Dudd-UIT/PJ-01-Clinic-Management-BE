const db = require("../../config/db");

// GET /role/getAll
const getAll = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM PHONGKHAM`;

    const phongKham = await db.executeQuery(sqlQuery);

    res.status(200).json({
      errcode: 0,
      message: "Successful",
      data: phongKham,
    });
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({
      errcode: -1,
      message: "Error from server",
      data: [],
    });
  }
};

module.exports = {
  getAll,
};
