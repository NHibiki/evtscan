const fs = require('fs'),
      path = require('path'),
      KoaStatic     = require('koa-static'),
      KoaSend       = require('koa-send'),
      KoaRouter     = require('koa-router');

const router = new KoaRouter();
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
       .use(router.allowedMethods())
       .use(KoaStatic(path.join(__dirname, '../web')))
       .use(async (ctx, next) => {
            await next();
            if (ctx.status === 404 && ctx.path.startsWith("/api/")) {
                ctx.type = 'application/json';
                ctx.set('Access-Control-Allow-Origin', '*');
                ctx.set('Access-Control-Allow-Methods', 'GET');
                ctx.body = { state: 0, error: 'no such api' };
            } else if (ctx.status === 404 && ctx.method === 'GET') try {
                await KoaSend(ctx, '/web/index.html')
            } catch (err) {console.error(err)}
       });

}

module.exports = { inject };