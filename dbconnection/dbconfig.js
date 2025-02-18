

const { MySQL2Extended } = require('mysql2-extended');
const { createPool } = require("mysql2/promise")



const pool =createPool({
    host: 'mysql.gb.stackcp.com',
    user: 'productiondb-353037359da7',
    password: 'gtwfuloe6n',
    database: 'productiondb-353037359da7',
    port: 62814
});



const db = new MySQL2Extended(pool);

module.exports = db;