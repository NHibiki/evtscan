const PG = require('pg');

var PostgresHost = 'localhost';
var PostgresPort = 5432;
var PostgresUser = 'postgres';
var PostgresPass = '';
var PostgresDB = 'evt';

const init = async function (postURL="", postUser=null, postPass=null, evtDB=null) {
    
    if (postURL)  PostgresHost = postURL.split(":")[0] || 'localhost';
    if (postURL)  PostgresPort = parseInt(postURL.split(":")[1], 10) || 5432;
    if (postUser) PostgresUser = postUser;
    if (postPass) PostgresPass = postPass;
    if (evtDB)    PostgresDB   = evtDB;
    
    if (!PostgresHost || !PostgresPort || !PostgresDB) {
        console.error("[Error] Missing credentials for Postgres DB");
        process.exit(1);
    }

    let err = await check();
    if (err) {
        console.error("[Error] Postgres Connection Error!");
        console.error(err.message);
        process.exit(1);
    }
    return true;

}

const check = async function () {

    let [err, ans] = await db(async evtDB => {
        let now = await evtDB.query(`SELECT now()`);
        return now;
    });
    if (err) {
        return err;
    }
    return null;

}

const db = async function (next) {
    
    try {
        let client = new PG.Client({
            user: PostgresUser,
            host: PostgresHost,
            database: PostgresDB,
            password: PostgresPass,
            port: PostgresPort,
        });
        client.connect();
        let answer = await next(client);
        client.end();
        return [null, answer];
    } catch (err) {
        return [err, null];
    }

}

module.exports = {
    init, db
}