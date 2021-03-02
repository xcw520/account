const api = require('../congfig/Apiconfig');
const jwt = require('jsonwebtoken');

module.exports = async function (data) {
    let token = jwt.sign(
        data,
        api.secrect,
        {
            expiresIn: api.time
        }
    );
    return token;
}