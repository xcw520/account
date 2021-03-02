const mysql = require('mysql');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: 3306,
    database: 'testdb'
});

module.exports = function (sqlAll) {

    return new Promise((resolve, reject) => {

        pool.getConnection((err, conn) => {
            if (err) throw err;
    
            conn.beginTransaction(err => {
    
                try {
    
                    if (err) throw err;

                    for (let i = 0; i < sqlAll.length; i++) {

                        conn.query(sqlAll[i]['sql'], sqlAll[i]['params'], (err, result) => {
                            if (err) {
                                conn.rollback(function(){});
                                throw err;
                            }
                        });

                    }

                    conn.commit(function(){
                        resolve('ok');
                    });

    
                } finally {
                    conn.release();
                }
    
            })
    
        })

    })

}