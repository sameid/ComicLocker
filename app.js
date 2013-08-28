/**
 * Module dependencies. 
 */
//test
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , comic = require ('./routes/comics')
  , http = require('http')
  , path = require('path');
 
var RedisStore = require('connect-redis')(express); 

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({store: new RedisStore,secret: 'trolol'}));
app.use(app.router);
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(express.errorHandler());

//general
app.get('/',checkAuth, routes.index);
app.get('/login', routes.login);
app.get('/upload', routes.upload);
app.post('/login', user.login);
app.get('/logout', user.logout);

//rest api
app.get('/user/space', user.currentUserSpace);
app.get('/comics', checkAuth, comic.findAll);
app.get('/comics/:hash', checkAuth, comic.findByHash);
app.post('/comics', /*checkAuth,*/ comic.uploadComic);
app.delete('/comics/:hash', checkAuth, comic.deleteComic);
app.get('/comics/:hash/:page', checkAuth, comic.findPageByHash);
app.get('/comic_size/:hash', checkAuth, comic.sizeByHash);

function checkAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
	  //res.send(403,{'error':'you are not allowed to access this page'});
    res.render('login');
  }
}

app.get('/comics', user.checkUserAuth, comic.findAll);
app.get('/comics/:hash', user.checkUserAuth, comic.findByHash);
app.post('/comics', /*checkAuth,*/ comic.uploadComic);
app.delete('/comics/:hash', user.checkUserAuth, comic.deleteByHash);
app.get('/comics/:hash/:page', user.checkUserAuth, comic.findPageByHash);
app.get('/comic_size/:hash', user.checkUserAuth, comic.sizeByHash);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Comicstack listening on port ' + app.get('port'));
});
