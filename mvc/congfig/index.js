module.exports = {
    common: {
        port: 3000,
        default_controller: 'Index',
        default_action: 'index',
        default_c_name: 'c',
        default_a_name: 'a',
        default_modelName: 'admin'
    },
    db: {
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'account',
        charset: 'utf8',
        port: 3306,
        acquireTimeout: 15000,//连接时间
        connectionLimit: 100,//最大连接数
        waitForConnections: true,//超最大连接数时排队
        queueLimit: 0//允许排队的最大数量 0不做限制
    },
    other: {
        pagesize: 5,
        menusize: 5,
        table:'ac_blog'
    },
    host: {
        'node.com:3000': 'admin',
        'api.node.com:3000': 'api'
    },
    cookie: {
        secret: 'mysecret',
        options: {
            httpOnly: true,
            maxAge: 10 * 24 * 3600 * 1000,
            domain: ' node.com '
        }
    },
    session: {
        store: {
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '123456',
            database: 'session',
            character: 'utf8'
        },
        key: 'session_cookie_name',//自定义签名
        secret: 'session_cookie_secret',//秘钥
        resave: false,
        saveUninitialized: false
    },
    upload:{
        file_type:['image/jpeg']
    },
    public_control: ['User/login', 'User/getCaptcha', 'Index/logout', 'Index/getlist', 'Index/test', 'Money/type', 'User/logup', 'User/changeinfo'],
    common_power: ['Login/login', 'Index/index', 'Index/welcome', 'Index/getList'],
    master_role_id: 1

}