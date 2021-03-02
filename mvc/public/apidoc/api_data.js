define({ "api": [
  {
    "type": "get",
    "url": "user/captcha",
    "title": "获取验证码",
    "description": "<p>移动端获取验证码接口</p>",
    "name": "Captcha",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "phone",
            "description": "<p>手机号</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "msg",
            "description": "<p>描述</p>"
          },
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>数据(经过md5加密的验证码)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     \"code\": 200,\n     \"msg\": \"ok\",\n     \"data\": {\n         \"captcha\": \"jhkdsfkjsdhgifhdfuhgjkdfhgkfdjghksdfhg\"\n     }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n     \"code\": 401,\n     \"msg\": \"格式不正确\"\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://api.node.com:3000/user/captcha"
      }
    ],
    "version": "1.0.0",
    "filename": "controllers/api/UserController.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "user/changeinfo",
    "title": "上传个人信息的头像",
    "description": "<p>移动端上传个人信息的头像接口</p>",
    "name": "Changeinfo",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "file",
            "optional": false,
            "field": "files.file",
            "description": "<p>图片文件</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "msg",
            "description": "<p>描述</p>"
          },
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>数据</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "url",
            "description": "<p>头像路径</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     \"code\": 200,\n     \"msg\": \"ok\"\n     \"data\": {\n         \"url\": \"public/1.jpg\",\"\n     }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:   ",
          "content": "{\n     \"code\": 404,\n     \"msg\": \"用户不存在\"\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://api.node.com:3000/user/changeinfo"
      }
    ],
    "version": "1.0.0",
    "filename": "controllers/api/UserController.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "user/changepass",
    "title": "修改密码",
    "description": "<p>移动端修改密码接口</p>",
    "name": "Changepass",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "upass",
            "description": "<p>旧密码</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "newupass",
            "description": "<p>新密码</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "checkpass",
            "description": "<p>确认密码</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "msg",
            "description": "<p>描述</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     \"code\": 200,\n     \"msg\": \"ok\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:   ",
          "content": "{\n     \"code\": 404,\n     \"msg\": \"用户不存在\"\n}\n{\n     \"code\": 403,\n     \"msg\": \"密码不正确\"\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://api.node.com:3000/user/changepass"
      }
    ],
    "version": "1.0.0",
    "filename": "controllers/api/UserController.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "user/getinfo",
    "title": "获取用户详细资料",
    "description": "<p>移动端获取用户资料接口</p>",
    "name": "Getinfo",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "msg",
            "description": "<p>描述</p>"
          },
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>数据</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "nickname",
            "description": "<p>头像路径</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "tittleName",
            "description": "<p>显示在资料卡上部Hello 后面的名称</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "attar",
            "description": "<p>头像路径</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "sex",
            "description": "<p>性别 0为男 1为女</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "birthday",
            "description": "<p>生日为时间戳</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "phone",
            "description": "<p>手机号</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>邮箱</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     \"code\": 200,\n     \"msg\": \"ok\"\n     \"data\": {\n         \"tittleName\": \"admin\", \n         \"nickname\": \"lc\",\n         \"attar\": \"public/1.jpg\",\n         \"sex\": 0,\n         \"birthday\": \"18054354558\",\n         \"phone\": 18046290376,\n         \"email\": \"1042440753@qq.com\"\n     }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:   ",
          "content": "{\n     \"code\": 404,\n     \"msg\": \"用户不存在\"\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://api.node.com:3000/user/getinfo"
      }
    ],
    "version": "1.0.0",
    "filename": "controllers/api/UserController.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "user/logup",
    "title": "注册",
    "description": "<p>移动端注册接口</p>",
    "name": "Logup",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "uname",
            "description": "<p>用户名</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "upass",
            "description": "<p>密码</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "checkpass",
            "description": "<p>确认密码</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "phone",
            "description": "<p>手机号</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "msg",
            "description": "<p>描述</p>"
          },
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>数据</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     \"code\": 200,\n     \"msg\": \"ok\",\n     \"data\": {\n         \"token\": \"jhkdsfkjsdhgifhdfuhgjkdfhgkfdjghksdfhg\"\n     }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n     \"code\": 402,\n      \"msg\": \"数据为空\"\n}\n{\n     \"code\": 401,\n     \"msg\": \"格式不正确\"\n}    \n{\n     \"code\": 405,\n     \"msg\": \"用户已存在\"\n}\n{\n     \"code\": 403,\n     \"msg\": \"密码不正确\"\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://api.node.com:3000/user/logup"
      }
    ],
    "version": "1.0.0",
    "filename": "controllers/api/UserController.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "user/setinfo",
    "title": "上传个人信息",
    "description": "<p>移动端上传个人信息接口</p>",
    "name": "Setinfo",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "nickname",
            "description": "<p>昵称</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "sex",
            "description": "<p>性别（0为男，1为女）</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "birthday",
            "description": "<p>生日（时间戳）</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "phone",
            "description": "<p>手机</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>邮箱</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "attar",
            "description": "<p>头像名称</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "msg",
            "description": "<p>描述</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     \"code\": 200,\n     \"msg\": \"ok\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:   ",
          "content": "{\n     \"code\": 404,\n     \"msg\": \"文件未找到\"\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://api.node.com:3000/user/changeinfo"
      }
    ],
    "version": "1.0.0",
    "filename": "controllers/api/UserController.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "user/login",
    "title": "登录",
    "description": "<p>移动端登录接口</p>",
    "name": "login",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "uname",
            "description": "<p>用户名</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "upass",
            "description": "<p>密码</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "msg",
            "description": "<p>描述</p>"
          },
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>数据</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     \"code\": 200,\n     \"msg\": \"ok\",\n     \"data\": {\n         \"token\": \"jhkdsfkjsdhgifhdfuhgjkdfhgkfdjghksdfhg\"\n     }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n     \"code\": 404,\n     \"msg\": \"用户名不存在\"\n}\n{\n     \"code\": 403,\n     \"msg\": \"密码错误\"\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://api.node.com:3000/user/login"
      }
    ],
    "version": "1.0.0",
    "filename": "controllers/api/UserController.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "api/getToken",
    "title": "获取token",
    "description": "<p>移动端axios获取token接口</p>",
    "name": "getToken",
    "group": "api",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "appid",
            "description": "<p>token_id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "secrect",
            "description": "<p>token_secrect</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data",
            "description": "<p>token码</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     \"data\": \"sfgsfdsfsdfsdf\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:   ",
          "content": "{\n     \"code\": 503,\n     \"msg\": \"非法AppId\"\n}，\n{\n     \"code\": 504,\n     \"msg\": \"AppSecret不正确\"\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://api.node.com:3000/api/getToken"
      }
    ],
    "version": "1.0.0",
    "filename": "controllers/api/ApiController.js",
    "groupTitle": "api"
  },
  {
    "type": "get",
    "url": "charts/getdata",
    "title": "获取图表数据",
    "description": "<p>移动端获取图表数据接口</p>",
    "name": "getdata",
    "group": "charts",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "kind",
            "description": "<p>时间种类（1.周 2.月 3.年）</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "accountkind",
            "description": "<p>收入支出种类 （expensecharts/incomecharts）</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "msg",
            "description": "<p>描述</p>"
          },
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>数据</p>"
          },
          {
            "group": "Success 200",
            "type": "array",
            "optional": false,
            "field": "arr",
            "description": "<p>统计图的横坐标</p>"
          },
          {
            "group": "Success 200",
            "type": "array",
            "optional": false,
            "field": "arr2",
            "description": "<p>统计图的数据点</p>"
          },
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "first",
            "description": "<p>消费排行第一的数据</p>"
          },
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "second",
            "description": "<p>消费排行第二的数据</p>"
          },
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "third",
            "description": "<p>消费排行第三的数据</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>消费排行的分类名称</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "num",
            "description": "<p>消费排行的分类花费</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "acount",
            "description": "<p>总消费金额</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     \"code\": 200,\n     \"msg\": \"ok\",\n     \"data\": {\n         \"arr\": ['1天', '2天', '3天', '4天', '5天','6天', '7天', '8天', '9天', '10天', '11天', '12天','13天','14天','15天','16天', '17天', '18天', '19天', '20天','21天', '22天', '23天', '24天', '25天', '26天', '27天','28天','29天','30天','31天'],\n         \"arr2\": ['20','30','50','10','12','30','20','30','50','10','12','30','50','28','100','20','30','50','10','12','30','20','30','50','10','12','30','50','28','100','60'],\n         \"first\": {\n             \"name\": \"购物\", \n             \"num\":1000}\n         },\n         \"second\": {\n             \"name\": \"出行\", \n             \"num\": 200\n         },\n         \"third\": {\n             \"name\": \"教育\", \n             \"num\": 100\n         },\n         \"acount\": 5000\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n     \"code\": 404,\n     \"msg\": \"用户不存在\"\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://api.node.com:3000/charts/getdata"
      }
    ],
    "version": "1.0.0",
    "filename": "controllers/api/ChartsController.js",
    "groupTitle": "charts"
  },
  {
    "type": "get",
    "url": "city/weather",
    "title": "获得天气api城市的id",
    "description": "<p>移动端定位城市获取城市id的接口</p>",
    "name": "weather",
    "group": "city",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "city",
            "description": "<p>城市名</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "msg",
            "description": "<p>描述</p>"
          },
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>数据</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "cityid",
            "description": "<p>城市id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     \"code\":200,\n     \"msg\":\"ok\",\n     \"data\":{\n         cityid:\"101230201\"\n      }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n     \"code\":\"504\",\n     \"msg\":\"定位失败\"\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://api.node.com:3000/city/weather"
      }
    ],
    "version": "1.0.0",
    "filename": "controllers/api/CityController.js",
    "groupTitle": "city"
  },
  {
    "type": "get",
    "url": "money/account",
    "title": "获取用户账单资料",
    "description": "<p>移动端获取用户账单资料接口</p>",
    "name": "account",
    "group": "money",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "year",
            "description": "<p>年</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "month",
            "description": "<p>月</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "msg",
            "description": "<p>描述</p>"
          },
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>数据</p>"
          },
          {
            "group": "Success 200",
            "type": "array",
            "optional": false,
            "field": "list",
            "description": "<p>月度账单列表</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "date",
            "description": "<p>日期</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "allexpense",
            "description": "<p>该日总支出</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "allincome",
            "description": "<p>该日总收入</p>"
          },
          {
            "group": "Success 200",
            "type": "array",
            "optional": false,
            "field": "money",
            "description": "<p>该日账单列表</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "type",
            "description": "<p>账单类型</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "num",
            "description": "<p>账单金额 （-为支出 +为收入）</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "id",
            "description": "<p>账单id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     \"code\": 200,\n     \"msg\": \"ok\"\n     \"data\": {\n         \"monthexpense\": 5000,\n         \"monthincome\": 2000,\n         \"list\": [\n             {\n                 \"date\": \"1月1日\",\n                 \"allexpense\": 100,\n                 \"allincome\": 50,\n                 \"money\": [\n                     {\n                         \"type\": \"饮食\",\n                         \"num\": \"-80\",\n                         \"id\": 1001,\n                         \"msg\": \"啦啦啦\"\n                     },\n                     {\n                         \"type\": \"出行\",\n                         \"num\": \"20\",\n                         \"id\": 1002,\n                         \"msg\": \"哦哦哦\"\n                     }\n             },\n             {\n                 \"date\": \"1月2日\",\n                 \"allexpense\": 100,\n                 \"allincome\": 50,\n                 \"money\": [\n                     {\n                         \"type\": \"饮食\",\n                         \"num\": \"-80\",\n                         \"id\": 1003,\n                         \"msg\": \"啦啦啦\"\n                     },\n                     {\n                         \"type\": \"出行\",\n                         \"num\": \"20\",\n                         \"id\": 1004,\n                         \"msg\": \"哦哦哦\"\n                     }\n             }\n         ]\n     }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:   ",
          "content": "{\n     \"code\": 404,\n     \"msg\": \"用户不存在\"\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://api.node.com:3000/money/account"
      }
    ],
    "version": "1.0.0",
    "filename": "controllers/api/MoneyController.js",
    "groupTitle": "money"
  },
  {
    "type": "get",
    "url": "money/del",
    "title": "删除账单信息",
    "description": "<p>移动端删除账单接口</p>",
    "name": "del",
    "group": "money",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "mid",
            "description": "<p>账单id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "msg",
            "description": "<p>描述</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     \"code\": 200,\n     \"msg\": \"ok\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:   ",
          "content": "{\n     \"code\": 404,\n     \"msg\": \"账单不存在\"\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://api.node.com:3000/money/del"
      }
    ],
    "version": "1.0.0",
    "filename": "controllers/api/MoneyController.js",
    "groupTitle": "money"
  },
  {
    "type": "post",
    "url": "money/setmoney",
    "title": "存储账单记录",
    "description": "<p>移动端存储账单记录的接口</p>",
    "name": "setmoney",
    "group": "money",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tid",
            "description": "<p>账单总类型（1.支出 2.收入）</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "money",
            "description": "<p>账单金额</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "remark",
            "description": "<p>账单备注</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "date",
            "description": "<p>账单生成日期</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "type",
            "description": "<p>账单明细类型</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "msg",
            "description": "<p>描述</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     \"code\":200,\n     \"msg\":\"ok\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n     code: 402,\n     msg: \"数据为空\"\n}\n{\n     code:500,\n     msg:\"账单储存失败\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controllers/api/MoneyController.js",
    "groupTitle": "money"
  },
  {
    "type": "get",
    "url": "money/type",
    "title": "获取账单类型",
    "description": "<p>移动端获取账单类型接口</p>",
    "name": "type",
    "group": "money",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tid",
            "description": "<p>账单总类型（1.支出 2.收入）</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "msg",
            "description": "<p>描述</p>"
          },
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>数据</p>"
          },
          {
            "group": "Success 200",
            "type": "array",
            "optional": false,
            "field": "list",
            "description": "<p>账单明细分类名</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     \"code\":200,\n     \"msg\":\"ok\",\n     \"data\":{\n         list:['出行', '住宿', '饮食', '教育', '娱乐']\n     }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n     code:404,\n     msg:\"分类不存在\"\n}",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://api.node.com:3000/money/type"
      }
    ],
    "version": "1.0.0",
    "filename": "controllers/api/MoneyController.js",
    "groupTitle": "money"
  },
  {
    "type": "get",
    "url": "plan/change",
    "title": "修改存钱计划的每日预算",
    "description": "<p>移动端修改每日预算数据接口</p>",
    "name": "change",
    "group": "plan",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "newbudget",
            "description": "<p>要修改每日预算的金额</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "year",
            "description": "<p>要显示的存钱计划年份</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "month",
            "description": "<p>要显示的存钱计划月份</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "day",
            "description": "<p>要显示的存钱计划日期</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "msg",
            "description": "<p>描述</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     \"code\": 200,\n     \"msg\": \"ok\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:   ",
          "content": "{\n     \"code\": 500,\n     \"msg\": \"修改失败\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controllers/api/PlanController.js",
    "groupTitle": "plan"
  },
  {
    "type": "get",
    "url": "plan/list",
    "title": "获取存钱计划的数据",
    "description": "<p>移动端获取存钱计划数据接口</p>",
    "name": "list",
    "group": "plan",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "year",
            "description": "<p>要显示的存钱计划年份</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "month",
            "description": "<p>要显示的存钱计划月份</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "day",
            "description": "<p>要显示的存钱计划日期</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "code",
            "description": "<p>状态码</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "msg",
            "description": "<p>描述</p>"
          },
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>数据</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "budget",
            "description": "<p>用户存钱计划的每日预算</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "allexpense",
            "description": "<p>用户本月到现在的总消费</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "out",
            "description": "<p>用户计划的今日支出</p>"
          },
          {
            "group": "Success 200",
            "type": "array",
            "optional": false,
            "field": "detail",
            "description": "<p>用户计划的支出详情</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     \"code\": 200,\n     \"msg\": \"ok\",\n     \"data\": {\n         \"budget\": 100.\n         \"allexpense\": 5000,\n         \"out\": 300,\n         \"detail\": [\n             {\n                 \"tname\": \"出行\",\n                 \"num\": 200\n             }\n         ]\n     }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controllers/api/PlanController.js",
    "groupTitle": "plan"
  }
] });
