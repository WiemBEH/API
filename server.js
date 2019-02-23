// Imports
var express     = require('express');
var bodyParser  = require('body-parser');
var apiRouter   = require('./apiRouter').router;
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var usersCtrl    = require('./routes/usersCtrl');

// Instantiate server
var server = express();

// Body Parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(express.static('public'));

// Configure routes
server.get('/', function (req, res) {
	res.render('login.ejs');
});


server.get('/login', function(req, res) {
	res.render('login.ejs');
});

server.get('/register', function(req, res) {
	res.render('register.ejs');
});

server.post('/home', usersCtrl.login);

server.use('/api/', apiRouter);

server.listen(8080, function() {
    console.log('Server en écoute :)');
});
