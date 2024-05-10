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


async function setIsolationLevel() {
  try {
    await connection.execute('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE');

    console.log('Transaction isolation level set to SERIALIZABLE.');
  } catch (error) {
    console.error('Error:', error);
  }
}


async function commit() {
  let connection;
  try {
    await connection.execute('COMMIT;')

    console.log('Transaction committed successfully.');
  } catch (error) {
    console.error('Error:', error);
    // Nếu có lỗi, rollback giao dịch
    if (connection) {
      try {
        await connection.rollback();
        console.log('Transaction rolled back successfully.');
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError);
      }
    }
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
  setIsolationLevel,
  commit,
  executeQuery,
  executeProcedure,
};
