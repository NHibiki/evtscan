// The Main Entry of Nodejs Server.
const Koa = require('koa');
const Router = require('./router/router');
const ArgParser = require('argparse').ArgumentParser;
const PackageConfig = require('./package.json');

const app = new Koa();
Router.inject(app);

const argParse = new ArgParser({
    version: PackageConfig.version,
    addHelp: true,
    description: 'The Explorer for Evt.'
});

argParse.addArgument(['-p', '--port'], { help: "Port for listening, default 80.", defaultValue: "80" });
argParse.addArgument(['-a', '--addr'], { help: "Address for listening, default localhost.", defaultValue: "localhost" });
argParse.addArgument(['-m', '--mgdb'], { help: "Mongo Server for connecting, default mongodb://localhost:27017.", defaultValue: "mongodb://localhost:27017" });

var args = argParse.parseArgs();

const serverAddr = args.addr;
const serverPort = parseInt(args.port, 10);
const mongoServer = args.mgdb;
if (!serverPort || !serverAddr) {
    console.error(`Fail to listen on ${serverAddr}:${serverPort}`);
    process.exit(1);
}

app.listen(serverPort, serverAddr).on('error', err => {
    console.error(`Fail to listen on ${serverAddr}:${serverPort}`);
    console.error(err.message);
    process.exit(1);
}).on('listening', () => {
    console.info(`EvtScan starts on ${serverAddr}:${serverPort}`);
});
