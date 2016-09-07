var mongoose = require('mongoose');

module.exports = function(config){
	mongoose.Promise = global.Promise;
	mongoose.connect(config.database, function(err){
		if(err){
			console.log("Err: ",err);
		}else{
			console.log("Database Connected", config.env);
		}
	});
}
