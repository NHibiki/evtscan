const PG = require('pg');
const Utils = require('./utils');

var PostgresHost = 'localhost';
var PostgresPort = 5432;
var PostgresUser = 'postgres';
var PostgresPass = '';
var PostgresDB = 'evt';

let pool = null;

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

    Utils.log('Initializing PostgreSQL Connection Pool.');

    pool = new PG.Pool({
        user: PostgresUser,
        host: PostgresHost,
        database: PostgresDB,
        password: PostgresPass,
        port: PostgresPort,
        max: 20
    });

    pool.on('error', err => {
        console.error('Unexpected error on pgsql pooling client', err);
    });

    let err = await check();
    if (err) {
        console.error("[Error] Postgres Connection Error!");
        console.error(err.message);
        if (pool && pool.end) {
            await pool.end();
        }
        process.exit(1);
    }
    Utils.log('PostgreSQL Initialization Complete.');
    return true;

}

const check = async function () {

    let [err] = await db(async evtDB => {
        let now = await evtDB.query(`SELECT * from pg_database`);//now()`);
        return now;
    });
    if (err) {
        return err;
    }
    return null;

}

const db = async function (next) {
    
    let client = null;
    try {
        Utils.log('PostgreSQL Connection Establishing.');
        const client = await pool.connect();
        Utils.log('PostgreSQL Connection Established.');
        let answer = await next(client);
        client.release();
        Utils.log('PostgreSQL Connection Released.');
        return [null, answer];
    } catch (err) {
        console.error("Query Error: ", err);
        if (client && client.release) {
            client.release();
        }
        return [err, null];
    }

}

module.exports = {
    init, db
}