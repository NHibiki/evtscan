const fs = require('fs');
const Router = require('koa-router');

const router = new Router();
const inject = function (app) {

    // make sure {Koa Instance} was passed in
    if (typeof app.use != 'function') {
        console.error('[Error] Initialization of Koa Failed!');
        process.exit(1);
    }

    // search current directory for all route files.
    fs.readdirSync(__dirname).forEach(rt => {
        if (rt !== 'router.js' && rt.endsWith('.js') && !rt.startsWith('.')) {
            require(`./${rt}`).forEach(([method, uri, fn]) => {

                // register routes to /api
                if (!uri.startsWith('/')) uri = '/' + uri;
                if (['get', 'post', 'put', 'del', 'all'].includes(method)) router[method](`/api${uri}`, fn);
            
            });
            console.log(`[Route] Load Route Module ${rt}`);
        }
    });

    app.use(router.routes())
       .use(router.allowedMethods());

}

module.exports = { inject };