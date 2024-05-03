const oracledb = require("oracledb");
require('dotenv').config();

const dbConfig = {
  user: process.env.USER_DB,
  password: process.env.PASSWORD_DB,
  connectString: process.env.CONNECT_STRING_DB,
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
    const result = await connection.execute(sqlQuery, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    return result.rows;
  } catch (error) {
    console.error("Oracle DB query error:", error);
    throw error;
  }
}

// Gọi stored procedure
async function executeProcedure(procedureName, bindVars) {
  const options = {
    autoCommit: true,
  };
  try {
    const result = await connection.execute(procedureName, bindVars, options);
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
