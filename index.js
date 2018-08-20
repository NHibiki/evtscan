// The Main Entry of Nodejs Server.
const Koa           = require('koa'),
      Router        = require('./router/router'),
      Mongo         = require('./lib/mongo'),
      ArgParser     = require('argparse').ArgumentParser,
      PackageConfig = require('./package.json');

// prepare for api routers
const app = new Koa();
Router.inject(app);

// parse process arguments for customize configurations.
const argParse = new ArgParser({
    version: PackageConfig.version,
    addHelp: true,
    description: 'The Explorer for Evt.'
});

argParse.addArgument(['-p', '--port'], { help: "Port for listening, default 80.", defaultValue: "80" });
argParse.addArgument(['-a', '--addr'], { help: "Address for listening, default localhost.", defaultValue: "localhost" });
argParse.addArgument(['-m', '--mgdb'], { help: "Mongo Server for connecting, default mongodb://localhost:27017.", defaultValue: "mongodb://localhost:27017" });
argParse.addArgument(['-b', '--db'  ], { help: "Specify Database for Mongo, default EVT", defaultValue: "EVT" });

var args = argParse.parseArgs();

const serverAddr  = args.addr;
const serverPort  = parseInt(args.port, 10);
const mongoServer = args.mgdb;
const mongoDB     = args.db;
if (!serverPort || !serverAddr) {
    console.error(`[Error] Fail to listen on ${serverAddr}:${serverPort}`);
    process.exit(1);
}
Mongo.init(mongoServer, mongoDB);

// start server
app.listen(serverPort, serverAddr).on('error', err => {
    console.error(`[Error] Fail to listen on ${serverAddr}:${serverPort}`);
    console.error(err.message);
    process.exit(1);
}).on('listening', () => {
    console.info(`[Info] EvtScan starts on ${serverAddr}:${serverPort}`);
});
