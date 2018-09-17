const PackageConfig = require('../package.json');

const StartTime = new Date().getTime();

// a simple test to see if the server is responding
const sysInfo = async (ctx, next) => {
    ctx.body = {
        name: "EvtScan Backend Server",
        version: PackageConfig.version,
        start: new Date(StartTime).toISOString(),
        onTime: parseInt((new Date().getTime() - StartTime) / 1000, 10)
    }
}

module.exports = [
    ['all', '/', sysInfo],
];