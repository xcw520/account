const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const logger = require('morgan');
const guide = require('../untils/guide');
const path = require('path');
const config = require('../congfig');
const cookie_parser = require('cookie-parser');
const session = require('express-session');
const mysqlstore = require('express-mysql-session')(session);
const multiparty = require('connect-multiparty');
const congfig = require('../congfig');
const Apiconfig = require('../congfig/Apiconfig');
let getActionName = require('../untils/getActionName');
let expressJwt = require('express-jwt');

module.exports = function (app) {
    app.set('views', './views');
    app.set('view engine', 'ejs');

    //允许跨域
    app.all('*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', '*');
        res.header('Access-Control-Allow-Methods', '*');
        next();
    });

    app.use(express.static(path.join(__dirname, '/../public')));
    //公共中间件
    app.use(logger('dev'));
    app.use(favicon(path.join(__dirname, '/../public', 'favicon.ico')));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(multiparty());
    let sessionstore = new mysqlstore(config.session.store);
    app.use(session({
        store: sessionstore,
        secret: config.session.secret,
        resave: config.session.resave,
        saveUninitialized: config.session.saveUninitialized,
    }));
    app.use(cookie_parser());

    let router = express.Router();
    router.use(guide, require('../middleware/checksession'), require('../middleware/checktoken'), require('../middleware/checkpower'));
    router.use((req, res, next) => {
        if (req.m == 'api') {
            next();
        } else {
            if (req.flag == 'no-pass') {
                res.send(`<script>  window.top.location.href = "/user/login"; </script>`);
            } else {
                if (req.through == 'no-through') {
                    res.send(`<script>  window.top.location.href = "/user/login"; </script>`);
                } else {
                    if (req.power == 'no-power') {
                        res.render('common/403');
                    } else {
                        if (req.c) {
                            let controller = require(`../controllers/${req.m}/${req.c}Controller`);
                            a = getActionName(req.a, req.method, controller);
                            if (controller[a]) {
                                controller[a](req, res, next);
                            } else {
                                next();
                            }
                        } else {
                            next();
                        }
                    }
                }
            }
        }
    })
    router.use(expressJwt({
        credentialsRequired: true,
        secret: Apiconfig.secrect,
        algorithms: ['HS256'],
    }).unless({
        path: Apiconfig.path
    }), require('../middleware/checkapi'), require('../middleware/checkallowed'), (req, res, next) => {
        if (req.c && req.c.indexOf('Upload')<0) {
            let controller = require(`../controllers/${req.m}/${req.c}Controller`);
            a = getActionName(req.a, req.method, controller);
            if (controller[a]) {
                controller[a](req, res, next);
            } else {
                next();
            }
        } else {
            next();
        }
    })

    app.use(router);


    //404
    app.use(require('../middleware/notFound'));

    //异常处理
    // app.use(require('../middleware/error'));

}