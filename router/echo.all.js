const PackageConfig = require('../package.json');

// a simple test to see if the server is responding
const sysInfo = async ctx => {
    ctx.body = {
        name: "EvtScan Backend Server",
        version: PackageConfig.version,
        db: ctx.state.config.db,
        startAt: new Date(ctx.state.config.startAt).toISOString(),
        onTime: parseInt((Date.now() - ctx.state.config.startAt) / 1000, 10)
    }
}

const siteInfo = async ctx => {
    ctx.body = {
        version: PackageConfig.version,
        startAt: new Date(ctx.state.config.startAt).toISOString(),
        prompt: ctx.state.config.siteInfo
    }
}

module.exports = [
    ['all', '/', sysInfo],
    ['all', '/info', siteInfo]
];