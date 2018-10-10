const PackageConfig = require('../package.json');

const StartTime = Date.now();

// a simple test to see if the server is responding
const sysInfo = async (ctx, next) => {
    ctx.body = {
        name: "EvtScan Backend Server",
        version: PackageConfig.version,
        start: new Date(StartTime).toISOString(),
        onTime: parseInt((Date.now() - StartTime) / 1000, 10)
    }
}

module.exports = [
    ['all', '/', sysInfo],
];