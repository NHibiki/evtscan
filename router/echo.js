const PackageConfig = require('../package.json');

// a simple test to see if the server is responding
const sysInfo = async (ctx, next) => {
    ctx.body = `EvtScan Backend Server. Version ${PackageConfig.version}`;
}

module.exports = [
    ['all', '/', sysInfo],
];