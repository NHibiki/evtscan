const PackageConfig = require('../package.json');

const sysInfo = async (ctx, next) => {

    ctx.body = `EvtScan Backend Server. Version ${PackageConfig.version}`;

}

module.exports = [
    ['all', '/', sysInfo],
];