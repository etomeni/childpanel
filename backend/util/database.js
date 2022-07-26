import mysql from 'mysql2';

// import readFile from 'fs/promises';
// const config = JSON.parse(await readFile(new url('../config/DBconfig.json', import.meta.url)));
// import config from '../config/DBconfig.json';

import config  from '../config/DBconnect.js';


const pool = mysql.createPool({
    host: config.DBcreated.host,
    port: config.DBcreated.port,
    user: config.DBcreated.user,
    database: config.DBcreated.database,
    password: config.DBcreated.password
});

export default pool.promise();
// module.exports = pool.promise();
