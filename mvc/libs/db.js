const mysql = require('mysql');
const config = require('../congfig');
let pool = mysql.createPool(config.db);
module.exports = {
    query: function (sql, data, cb) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            conn.query(sql, data, (err, res) => {
                if (err) throw err;
                conn.release();
                cb(res);
            })
        })
    },
    query2: function (sql, primas) {
        return new Promise(function (resolve, reject) {
            pool.getConnection((err, con) => {
                if (err) {
                    return reject(err)
                }
                con.query(sql, primas, (err2, result) => {
                    if (err2) {
                        return reject(err2)
                    }
                    resolve(result)
                    con.release()
                })
            })
        })
    }
}