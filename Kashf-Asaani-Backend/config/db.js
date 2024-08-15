const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const { DB_URL } = require("../Env");
const { DB_USERNAME } = require("../Env");
const { DB_PASSWORD } = require("../Env");

let connection;


async function initializeConnection() {
    if (!connection) {
        try {
            connection = await oracledb.getConnection({
                user: DB_USERNAME,
                password: DB_PASSWORD,
                connectString: DB_URL
            });
            console.log("Successfully connected to Oracle!");

        } catch (err) {
            console.error("Error during database connection", err);
            throw err;
        }
    }
    return connection;
}

module.exports = {
    getConnection: initializeConnection
};