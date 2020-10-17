const Pool = require('pg').Pool

const pool = new Pool({
    user: "postgres",
    password: "1928sfsf",
    host: "localhost",
    port: 5432,
    database: "footballtournaments",
});


module.exports = pool
