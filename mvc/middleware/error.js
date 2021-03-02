module.exports = function (err, req, res, next) {
        res.locals.message = err.message.replace(/\n/g, '<br>');
        res.locals.err = err;
        if (req.m == "api") {
            if (err.message == 'invalid token') {
                res.send({
                    code: 401,
                    msg: 'invalid token'
                })
            } else if (err.message == 'jwt expired') {
                res.send({
                    code: 402,
                    msg: 'jwt expired'
                })
            } else {
                res.send({
                    code: 500,
                    msg: 'error'
                })
            }
        } else {
            res.status(err.status || 500);
            res.render('common/error');
        }
    }