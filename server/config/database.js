
const sql = require('mssql');

const config = {
    user:"hayvan",
    password:"1234",
    server:"localhost\\SQLEXPRESS",
    database:"ef",
    options: {
        encrypt: true,
        trustServerCertificate: true,
        
    },
    port: 1433
};

module.exports = config;
