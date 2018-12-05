// The Main Entry of Nodejs Server.
const Koa           = require('koa'),
      Router        = require('./router/router'),
      Postgres      = require('./lib/postgres'),
      Mongo         = require('./lib/mongo'),
      ArgParser     = require('argparse').ArgumentParser,
      PackageConfig = require('./package.json');

// parse process arguments for customize configurations.
const argParse = new ArgParser({
    version: PackageConfig.version,
    addHelp: true,
    description: 'The Explorer for Evt.'
});

argParse.addArgument(['-p', '--port'    ], { help: "Port for listening, default 80.", defaultValue: "80" });
argParse.addArgument(['-a', '--addr'    ], { help: "Address for listening, default localhost.", defaultValue: "localhost" });
argParse.addArgument(['-m', '--mgdb'    ], { help: "Mongo Server for connecting, default mongodb://localhost:27017.", defaultValue: "mongodb://localhost:27017" });
argParse.addArgument(['-b', '--db'      ], { help: "Specify Database for Mongo, default EVT", defaultValue: "EVT" });
argParse.addArgument(['-g', '--postgres'], { help: "Postgres Server for connection, example localhost:5432", defaultValue: "" });
argParse.addArgument(['-u', '--postuser'], { help: "Postgres Server username, default evtscan", defaultValue: "evtscan" });
argParse.addArgument(['-s', '--postpass'], { help: "Postgres Server password, must be specified if using --postgres", defaultValue: "" });
// argParse.addArgument(['-s', '--ssr' ], { help: "Whether to turn on Server Side Rendering (Experimental).", defaultValue: "no"});

var args = argParse.parseArgs();

const serverAddr   = args.addr;
const serverPort   = parseInt(args.port, 10);
const mongoServer  = args.mgdb;
const databaseDB   = args.db;
const postgresAddr = args.postgres;
const postgresUser = args.postuser;
const postgresPass = args.postpass;
const ssr          = true; //args.ssr === "yes" ? true : false;
const dev          = serverPort !== 80;

if (ssr) {
    console.log('[Info] Running in SSR Mode.');
}
if (dev) {
    console.log('[Info] Running in DEV Mode.');
}
if (!serverPort || !serverAddr) {
    console.error(`[Error] Fail to listen on ${serverAddr}:${serverPort}`);
    process.exit(1);
}

var usingDB = "mongo";
if (!postgresAddr && !postgresPass) {
    console.log('[Info] Connecting Mongodb.');
    usingDB = "mongo";
    Mongo.init(mongoServer, databaseDB);
} else {
    if (!postgresAddr || !postgresPass) { console.error(`[Error] Missing arguments when using postgres`); process.exit(1); }
    console.log('[Info] Connecting Postgres.');
    usingDB = "postgres";
    Postgres.init(postgresAddr, postgresUser, postgresPass, databaseDB);
}

// prepare for api routers
const app = new Koa();
Router.inject(app, {ssr, dev, db: usingDB});

// start server
app.listen(serverPort, serverAddr).on('error', err => {
    console.error(`[Error] Fail to listen on ${serverAddr}:${serverPort}`);
    console.error(err.message);
    process.exit(1);
}).on('listening', () => {
    console.info(`[Info] EvtScan starts on ${serverAddr}:${serverPort}`);
});
