module.exports = {
 	development: {
 		"env": process.env.NODE_ENV,
		"database": "mongodb://localhost/real_time_meanstack",
		"port": process.env.PORT || 3000,
		"secretKey": "MySecretKey"
 	},

 	production: {
 		"env": process.env.NODE_ENV,
 		"database": "mongodb://root:admin@ds033015.mlab.com:33015/real_time_meanstack",
		"port": process.env.PORT || 80,
		"secretKey": "MySecretKey"
 	}

 }