const blogmodel = require('../../model/admin/Blog/Blog');
module.exports = {
    async get_blog(req, res, next) {
        let data = await blogmodel.getList(req);
        res.render('blog/blog', {
            data: data.result,
            keyword: data.keyword,
            starttime: data.starttime,
            endtime: data.endtime,
            kind: req.query.kind,
            html:data.html
        });
    },
    async get_deletemore(req, res, next) {
        let date = new Date();
        let y = date.getFullYear();
        let m = date.getMonth();
        let time = new Date(`${y}-${m+1}-${1} 0:0:0`).getTime();
        let result = await blogmodel.delmore(time);
        res.send(result);
    },
    async get_delete(req,res,next) {
        let result = await blogmodel.del(req);
        res.send(result);
    }
}