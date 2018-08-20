const fs = require('fs');
const Router = require('koa-router');

const router = new Router();
const inject = function (app) {

    if (typeof app.use != 'function') {
        console.error('Initialization of Koa Failed!');
        process.exit(1);
    }

    fs.readdirSync(__dirname).forEach(rt => {
        if (rt !== 'router.js' && rt.endsWith('.js') && !rt.startsWith('.')) {
            require(`./${rt}`).forEach(([method, uri, fn]) => {
                if (['get', 'post', 'put', 'del', 'all'].includes(method)) router[method](uri, fn);
            });
            console.log(`Load Route Module ${rt}`);
        }
    });

    app.use(router.routes())
       .use(router.allowedMethods());

}

module.exports = { inject };