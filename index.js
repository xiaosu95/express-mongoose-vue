const express = require('express');
const router = require('./routes/');
const path = require('path');
const pkg = require('./package');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('./config/default');
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
const IO = require('socket.io');
const socket = require('./socket/')

// 连接mongodb数据库
const db = mongoose.connect(config.mongodb);
db.connection.on('error', error => {
  console.log(`数据库连接失败--${error}`)
})
db.connection.on('open', () => {
  console.log(`数据库连接成功`)
})

const app = express();
// 静态资源
// app.use(express.static(path.join(__dirname, 'client/src')))
// app.use(express.static(path.join(__dirname, 'client/dist')))
app.use(express.static(path.join(__dirname, 'uploads')))
app.use(express.static(path.join(__dirname, 'blogPhoto')))
// 解析postbody参数
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// cookie 中间件
app.use(cookieParser());
// session 中间件
let sessionStore = new MongoStore({
  url: config.mongodb // mongodb 地址
})
app.use(session({
  name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true, // 强制更新 session
  rolling: true,
  saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge // 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: sessionStore // 将 session 存储到 mongodb
}));
// 路由
router(app);
const http = require('http').createServer(app);
http.listen(config.port, () => {
  console.log(`${pkg.name} listening on port ${config.port}`);
})

//all error中间件
app.use(function(err, req, res, next) {
  console.log("Error happens", err.stack);
  res.send({
    isSuccess: 0,
    msg: err.message
  })
});

// socket
const socketIO = IO.listen(http); // 创建socket服务
socket.socket(socketIO);
socketIO.set('authorization', (handshakeData, accept) => {
  let cookies = cookie.parse(handshakeData.headers.cookie); // 解析cookies
  let connectSid = cookies.session;
  if (connectSid) {
    let connected = cookieParser.signedCookie(connectSid, config.session.secret); // 验证session的secret
    if (connected) {
      sessionStore.get(connected)
      .then(session => {
        handshakeData.headers.sessions  = session; // 把当前用户数据传给socket.io的handshakeData
        if (session.user) {
          accept(null, true)  // 进行下面的链接
        }
      }, err => {
        accept(error.message, false)
      })
    }
  } else {
    accept('No session', false)
  }
})
module.exports = app;
