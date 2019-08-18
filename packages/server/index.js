// The Main Entry of Nodejs Server.
const Koa           = require('koa'),
      Router        = require('./router/router'),
      Postgres      = require('./lib/postgres'),
      EvtNet        = require('./lib/evtnet'),
      Utils         = require('./lib/utils'),
      ArgParser     = require('argparse').ArgumentParser,
      PackageConfig = require('./package.json');

// parse process arguments for customize configurations.
const argParse = new ArgParser({
    version: PackageConfig.version,
    addHelp: true,
    description: 'The Explorer for Evt.'
});

argParse.addArgument(['--debug'         ], { help: "Enable debug mode.", action: "count" });
argParse.addArgument(['-p', '--port'    ], { help: "Port for listening, default 80.", defaultValue: "80" });
argParse.addArgument(['-a', '--addr'    ], { help: "Address for listening, default localhost.", defaultValue: "localhost" });
argParse.addArgument(['-b', '--db'      ], { help: "Specify Database Name, default EVT", defaultValue: "EVT" });
argParse.addArgument(['-c', '--chain'   ], { help: "Specify Chaininfo, default empty to choose a random chain", defaultValue: "" });
argParse.addArgument(['-g', '--postgres'], { help: "Postgres Server for connection, example localhost:5432", defaultValue: "" });
argParse.addArgument(['-u', '--postuser'], { help: "Postgres Server username, default evtscan", defaultValue: "evtscan" });
argParse.addArgument(['-s', '--postpass'], { help: "Postgres Server password, must be specified if using --postgres", defaultValue: "" });
argParse.addArgument(['-i', '--siteinfo'], { help: "Additional information to be displayed on the main screen, empty to show nothing. (string, json, jsonfile)", defaultValue: "" });
// argParse.addArgument(['-s', '--ssr' ], { help: "Whether to turn on Server Side Rendering (Experimental).", defaultValue: "no"});

var args = argParse.parseArgs();

const debug        = args.debug;
const serverAddr   = args.addr;
const serverPort   = parseInt(args.port, 10);
const databaseDB   = args.db;
const chainNet     = args.chain;
const postgresAddr = args.postgres;
const postgresUser = args.postuser;
const postgresPass = args.postpass;
const ssr          = true; //args.ssr === "yes" ? true : false;
const dev          = serverPort !== 80;
const siteInfo     = args.siteinfo;

if (debug) {
    Utils.shared.debug = true;
    Utils.logWithType('Info ', 'Debug Mode is On.');
}

if (ssr) {
    Utils.logWithType('Info ', 'Running in SSR Mode.');
}
if (dev) {
    Utils.logWithType('Info ', 'Running in DEV Mode.');
}
if (!serverPort || !serverAddr) {
    console.error(`[Error] Fail to listen on ${serverAddr}:${serverPort}`);
    process.exit(1);
}

if (chainNet) {
     EvtNet.setRandomNode(chainNet);
}

var usingDB = "postgres";
if (postgresAddr) {
    Utils.logWithType('Info ', 'Connecting Postgres.');
    usingDB = "postgres";
    Postgres.init(postgresAddr, postgresUser, postgresPass, databaseDB);
}

// prepare for api routers
const app = new Koa();
Router.inject(app, {ssr, dev, db: usingDB, siteInfo: Utils.parseSiteInfo(siteInfo)});

// start server
app.listen(serverPort, serverAddr).on('error', err => {
    console.error(`[Error] Fail to listen on ${serverAddr}:${serverPort}`);
    console.error(err.message);
    process.exit(1);
}).on('listening', () => {
    Utils.logWithType('Info ', `EvtScan starts on ${serverAddr}:${serverPort}`);
});
