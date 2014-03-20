
/**
 * Module dependencies.
 */

var express   = require('express'),
    http      = require('http'),
    path      = require('path'),
    mongoose  = require('mongoose'),
    Snippet   = require('./lib/snippet.js');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

console.log("app running");

app.get('/snippets', Snippet.getSnippets);
app.get('/snippet/:snippetId', Snippet.getSnippetContent);
app.post('/snippet/save', Snippet.saveSnippet);

// Connect to mongo
mongoose.connect('127.0.0.1', 'coden', 27017, function(err) {
  if (err) {
    console.log('Could not connect to mongo: ' + err);
    process.exit(1);
  }

  // Start server
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Server listening on port ' + app.get('port'));
  });
});
