const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const expressJwt = require('express-jwt');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const roomRouter = require('./routes/livingRoom');

const app = express();

// 设置跨域头，允许全部跨域
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization,Origin,Accept,X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('X-Powered-By', ' 3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// 使用中间件
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression()); // 开启gzip压缩
// 设置jwt
app.use(expressJwt({
	secret: 'living_toto',
	algorithms: ['HS256'],
	credentialsRequired: true, //是否校验
}).unless({
	path: ['/users/login', '/livingRoom/roomList', '/livingRoom/roomListByType']
}));
// 设置路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/livingRoom', roomRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

// rtmp服务（流媒体服务器：转换流格式）
const NodeMediaServer = require('node-media-server')
const config = {
	rtmp: {
		port: 1935,
		chunk_size: 60000,
		gop_cache: true,
		ping: 30,
		ping_timeout: 60
	},
	http: {
		port: 8000,
		allow_origin: '*'
	}
}
const nms = new NodeMediaServer(config)
nms.run()

// socket服务，绑定http服务器实例
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);
const port = process.env.PORT || 8201;
require('events').EventEmitter.prototype._maxListeners = 1000;
let namespaceList = [{name: 'barrage', description: '弹幕模块'}]
for (let i in namespaceList) {
	if (namespaceList[i].name) {
		newNamespace(namespaceList[i].name)
	}
}
httpServer.listen(port, () => {
	console.log('listening on *:' + port)
})

// 监听新的命名空间
function newNamespace(space) {
	io.of(space).on('connection', socket => {
		socket.on('chat message', data => {
			socket.emit('chat message', data)
		})
		// 加入房间
		socket.on('JOINROOM', name => {
			socket.join(name)
		})
		// 离开房间
		socket.on('LEAVEROOM', name => {
			socket.leave(name)
		})
		// 发送房间聊天
		socket.on('ROOMCHAT', data => {
			io.of(space).to(data.room).emit(data.func, data.data)
		})
		// 加入自己的房间
		socket.on('JOINUSER', id => {
			socket.join(id)
		})
		// 发送用户私聊
		socket.on('USETCHAT', data => {
			io.of(space).to(data.id).emit(data.func, data.data)
		})
		// 发送公聊
		socket.on('COMMONCHAT', data => {
			socket.emit(data.func, data.data)
		})
	})
}

module.exports = app;
