var bodyParser = require('body-parser');
var morgan     = require('morgan');


module.exports = function(app, express, config) {
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
	app.use(morgan('dev'));
	// app.use(express.static(__dirname + '/client'));
}