const oracledb = require("oracledb");

const dbConfig = {
  user: "QUANLYPHONGKHAM2",
  password: "Admin123",
  connectString: "localhost/orcl",
};

let connection;

async function connect() {
  try {
    connection = await oracledb.getConnection(dbConfig);
    console.log("Connected to Oracle database successfully");
  } catch (err) {
    console.error("Error connecting to Oracle database:", err);
    throw err;
  }
}

// Thực thi truy vấn SQL
async function executeQuery(sqlQuery) {
  try {
    const result = await connection.execute(
      sqlQuery,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows;
  } catch (error) {
    console.error("Oracle DB query error:", error);
    throw error;
  }
}

// Gọi stored procedure
async function executeProcedure(procedureName, bindVars) {
  try {
    const result = await connection.execute(procedureName, bindVars);
    return result;
  } catch (error) {
    console.error("Oracle DB procedure execution error:", error);
    throw error;
  }
}

module.exports = {
  connect,
  executeQuery,
  executeProcedure,
};
