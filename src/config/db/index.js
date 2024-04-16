const oracledb = require('oracledb');

const dbConfig = {
    user: 'C##DOANDU',
    password: 'Admin123',
    connectString: 'localhost/orcl'
};

let connection;

async function connect() {
    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log('Connected to Oracle database successfully');
    } catch (err) {
        console.error('Error connecting to Oracle database:', err);
        throw err;
    }
}

async function executeQuery(sqlQuery) {
    try {
        if (!connection) {
            throw new Error('Database connection not established');
        }
        const result = await connection.execute(sqlQuery);
        return result.rows;
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

module.exports = {
    connect,
    executeQuery
};
