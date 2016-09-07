var env        = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var express    = require('express');
var app        = express();
var config     = require('./server/config/config')[env];
require('./server/config/express')(app, express, config);
require('./server/config/mongoose')(config);

var api = require('./server/routes/api.js')(app, express);
app.use('/api', api);


app.use(express.static(__dirname + '/client'));
app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res){
	res.sendFile(__dirname + '/client/app/views/index.html');
})

app.listen(config.port, function(err){
	if (err) {
		console.log('Error: ', err);
	}else{
		console.log("Server runs on port: ", config.port);
	}
});
