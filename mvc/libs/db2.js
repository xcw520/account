const config = require('../congfig');
const mysql = require('mysql');
const pool = mysql.createPool(config.db);
module.exports = {
    query: function (sql, primas) {
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
    },
    //增
    async add(table, data, where) {
        where = this.where(where);
        let fields = [];
        let values = [];
        for (let x in data) {
            fields.push(x);
            values.push(data[x]);
        }
        let sql = this.createSql('add', table, fields, where);
        return await this.query(sql, values);
    },
    //删
    async delete(table, where) {
        where = this.where(where);
        let sql = this.createSql('del', table, undefined, where);
        return await this.query(sql, []);
    },
    //改
    async save(table, data, where) {
        let fileds = [];
        let values = [];
        where = this.where(where);
        for (let x in data) {
            fileds.push(x);
            values.push(data[x]);
        }
        let sql = this.createSql('save', table, fileds, where);
        return await this.query(sql, values);
    },
    //查(单条)
    async find(table, fileds, where) {
        where = this.where(where);
        let sql = this.createSql('find', table, fileds, where);
        return await this.query(sql, []);
    },
    //查(多条)
    async select(table, fileds, where, others = {}) {
        where = this.where(where);
        let sql = this.createSql('select', table, fileds, where, others);
        return await this.query(sql, []);
    },
    where: function (where) {
        let returns = '';
        if (typeof where == 'string') {
            return where;
        }
        if (where instanceof Array) {
            where.forEach(item => {
                let returnobj = '';
                let log = (where['logic']) ? where['logic'] : 'AND';
                if (typeof item == 'string') {
                    returnobj += (returnobj == '') ? item : ' ' + logic + ' ' + item;
                } else {
                    if (typeof item == 'object') {
                        let logic = (item['logic']) ? item['logic'] : 'AND';
                        for (let x in item) {
                            if (typeof item[x] != 'object' && x != 'logic') {
                                returnobj += (returnobj == '') ? x + '=' + "'" + item[x] + "'" : ' ' + logic + ' ' + x + '=' + "'" + item[x] + "'";
                            } else {
                                if (item[x][0].toUpperCase() == 'IN' || item[x][0].toUpperCase() == 'IS') {
                                    returnobj += (returnobj == '') ? `${x} ${item[x][0]} ${item[x][1]}` :
                                        ' ' + logic + ' ' + `${x} ${item[x][0]} ${item[x][1]}`;
                                } else if (item[x][0].toUpperCase() == 'BETWEEN') {
                                    returnobj += (returnobj == '') ? `${x} BETWEEN ${item[x][1][0]} AND ${item[x][1][1]}` :
                                        ' ' + logic + ' ' + `${x} BETWEEN ${item[x][1][0]} AND ${item[x][1][1]}`;
                                } else if (x != 'logic') {
                                    returnobj += (returnobj == '') ? `${x} ${item[x][0].toUpperCase()} '${item[x][1]}'` :
                                        ' ' + logic + ' ' + `${x} ${item[x][0].toUpperCase()} '${item[x][1]}'`;
                                }
                            }
                        }
                    }
                }
                if (returnobj) {
                    returns += (returns == '') ? returnobj : ' ' + log + ' ' + returnobj;
                }
                
            })
        } else if (typeof where == 'object') {
            let logic = (where['logic']) ? where['logic'] : 'AND';
            for (let x in where) {
                if (typeof where[x] != 'object' && x != 'logic') {
                    returns += (returns == '') ? x + '=' + "'" + where[x] + "'" : ' ' + logic + ' ' + x + '=' + "'" + where[x] + "'";
                } else {
                    if (where[x][0].toUpperCase() == 'IN' || where[x][0].toUpperCase() == 'IS') {
                        returns += (returns == '') ? `${x} ${where[x][0]} ${where[x][1]}` :
                            ' ' + logic + ' ' + `${x} ${where[x][0]} ${where[x][1]}`;
                    } else if (where[x][0].toUpperCase() == 'BETWEEN') {
                        returns += (returns == '') ? `${x} BETWEEN ${where[x][1][0]} AND ${where[x][1][1]}` :
                            ' ' + logic + ' ' + `${x} BETWEEN ${where[x][1][0]} AND ${where[x][1][1]}`;
                    } else if (x != 'logic') {
                        returns += (returns == '') ? `${x} ${where[x][0].toUpperCase()} '${where[x][1]}'` :
                            ' ' + logic + ' ' + `${x} ${where[x][0].toUpperCase()} '${where[x][1]}'`;
                    }
                }
            }
        } else {
            return false;
        }
        return returns;
    },
    createSql: function (type, table, fields, where = undefined, others = {}) {
        switch (type) {
            case 'add': {
                let sql = '';
                let values = Array.from({ length: fields.length }).map((values, index) => "?");
                return sql = `INSERT INTO ${table}(${fields.join(',')}) VALUES(${values.join(',')})`;
            }
            case 'del': {
                if (where) {
                    let sql = '';
                    return sql = `DELETE FROM ${table} WHERE ${where}`;
                }
            }
            case 'save': {
                if (where) {
                    let save = '';
                    fields.forEach(item => {
                        save += (save == '') ? `${item}=?` : ` ,${item}=?`;
                    });
                    return sql = `UPDATE ${table} SET ${save} WHERE ${where}`;
                }
            }
            case 'find': {
                sql = `SELECT ${fields.join(',')} FROM ${table}`;
                if (where) sql += ` WHERE ${where}`;
                sql += ' LIMIT 1';
                return sql;
            }
            case 'select': {
                sql = `SELECT ${fields.join(',')} FROM ${table}`;
                if (where) sql += ` WHERE ${where}`;
                if (others['group']) sql += ` GROUP BY ${others['group']}`;
                if (others['order']) sql += ` ORDER BY ${others['order']}`;
                if (others['limit']) sql += ` LIMIT ${others['limit']}`;
                return sql;
            }
        }
    }
}