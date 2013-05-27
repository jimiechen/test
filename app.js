
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , path = require('path')
  , fs = require('fs')
  , url= require('url')
  , mongoose = require('mongoose');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({uploadDir:'./public/upload/tmp'}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// 后台管理页面
app.use('/mgr', express.static(__dirname + '/mgr'))

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Bootstrap models
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
  if(file.substring(0,1)!=='.'){
  	require(models_path+'/'+file)
  }
})

user = require('./routes/user')
// Bootstrap db connection
mongoose.connect(config.db)

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/getid', user.getid);
app.get('/users/itemList', user.itemList);
app.post('/users/itemList', user.itemList);
//app.get('/users/addItem', user.getItem);
app.get('/getNaviTree', routes.getNaviTree);
app.get('/add', user.add);
app.post('/addTreeNode', user.addTreeNode);
app.post('/getTreeNodes', user.getTreeNodes);
app.post('/updateNode', user.updateNode);
//swfupload上传
app.post('/upload', function(req,res){
	 // 获得文件的临时路径
     var tmp_path = req.files.Filedata.path;
    // 指定文件上传后的目录 - 
    var target_path = './public/upload/' + req.files.Filedata.name;
    // 移动文件
    fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
      // 删除临时文件夹文件, 
      fs.unlink(tmp_path, function() {
         if (err) throw err;
         res.send('File uploaded to: ' + target_path + ' - ' + req.files.Filedata.size + ' bytes');
      });
	 });
});
app.get('/imageLib', function(req,res){
	var data = url.parse(req.url,true).query;
	var pageIndex = data.pageIndex||0;
	var pageSize = data.pageSize;
	console.log("pageIndex:"+pageIndex);
	var names = [['a0', 'b0', 'c0','d', 'e', 'f','a', 'b', 'c','d', 'e', 'f'],
	['a1', 'b1', 'c','d', 'e', 'f','a', 'b', 'c','d', 'e', 'f'],
	 ['a2', 'b2', 'c','d', 'e', 'f','a', 'b', 'c','d', 'e', 'f'],
	 ['a3', 'b3', 'c','d', 'e', 'f','a', 'b', 'c','d', 'e', 'f'],
	 ['a4', 'b4', 'c','d', 'e', 'f','a', 'b', 'c','d', 'e', 'f']];
	 console.log(names[pageIndex]);
	res.render('imageLib', { names: names[pageIndex],total:50 });
});

app.get('/imageLib2', function(req,res){
	var data = url.parse(req.url,true).query;
	var pageIndex = data.pageIndex||0;
	var pageSize = data.pageSize;
	console.log("pageIndex:"+pageIndex);
	var names = [
	['a0', 'b0', 'c0','d', 'e', 'f','a', 'b', 'c','d', 'e', 'f'],
	['a1', 'b1', 'c','d', 'e', 'f','a', 'b', 'c','d', 'e', 'f'],
	['a2', 'b2', 'c','d', 'e', 'f','a', 'b', 'c','d', 'e', 'f'],
	['a3', 'b3', 'c','d', 'e', 'f','a', 'b', 'c','d', 'e', 'f'],
	['a4', 'b4', 'c','d', 'e', 'f','a', 'b', 'c','d', 'e', 'f']
	];
	 console.log(names[pageIndex]);
	res.json(200, { names: names[pageIndex],total:50 });
});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});