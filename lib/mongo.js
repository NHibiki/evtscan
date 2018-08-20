const MongoClient = require('mongodb').MongoClient;

var MongoHost = 'mongodb://localhost:27017';
var EVTDB = 'EVT';

const init = async function (mongoURL=null, evtDB=null) {
    
    if (mongoURL) MongoHost = mongoURL;
    if (evtDB) EVTDB = evtDB;
    
    let err = await check();
    if (err) {
        console.error("[Error] Mongo Connection Error!");
        console.error(err.message);
        process.exit(1);
    }
    return true;

}

const check = async function () {

    let [err, ans] = await db(async evtDB => {
        return evtDB.admin().ping();
    });
    if (err) {
        return err;
    }
    return null;

}

const db = async function (next) {
    
    try {
        let client = await MongoClient.connect(MongoHost, { useNewUrlParser: true });
        let evtDB  = client.db(EVTDB);
        let answer = await next(evtDB);
        client.close();
        return [null, answer];
    } catch (err) {
        return [err, null];
    }

}

module.exports = {
    init, db
}