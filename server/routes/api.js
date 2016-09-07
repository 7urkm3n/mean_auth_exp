var User      = require('../models/user');
var Story     = require('../models/story');
var config    = require('../config/config')['development'];  
var jwt       = require('jsonwebtoken');
var secretKey = config.secretKey;

function createToken(user){
	var token = jwt.sign({
		_id: user._id,
		username: user.username,
	}, secretKey, {
		expiresIn: 84640
	});

	return token;
};

module.exports = function(app, express) {
	var api = express.Router();

	api.post('/signup', function(req, res, next){

		console.log("REQ:", req.body);

		var user = new User({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password
		});
		var token = createToken(user);

		user.save(function(err){
			if (err){
				res.send(err);
				return;
			};

			res.json({
				success: true,
				token: token,
				message: "User has been created"
			});

		});
	})
	.get('/users', function(req, res){
		User.find({}, function(err, users){
			if (err) {
				res.send();
				return;
			}
			res.json(users);
		})
	})
	.post('/login', function(req, res){
		User.findOne({
			username: req.body.username
		}).select('username password').exec(function(err, user){
			if (err) throw err;
			if (!user) {
				res.send({message: "User doesnt exist"})
			}else if(user){
				var validPassword = user.comparePassword(req.body.password)
				if (!validPassword) {
					res.send({message: "Invalid Password"});
				}else{
					var token = createToken(user);
					res.json({
						success: true,
						message: "Successfully Login!",
						token: token
					});
				}
			}
		});
	});

// Middleware to authenticate with Token !
	api.use(function(req, res, next){
		// var token = req.body.token || req.param('token') ||req.headers['x-access-token'];
		var token = req.headers['x-access-token'];
		console.log(token)
		if(token) {
			jwt.verify(token, secretKey, function(err, decoded){
				if (err) {
					res.status(403).send({
						success: false,
						message: "Failed to Authenticate User"
					})
				}else{
					req.decoded = decoded;
					next();
				}
			});
		}else{
			res.status(403).send({
				success: false,
				message: "No Token Provided"
			})
		}
	});

	api.route('/')
		.post(function(req, res){
			var story = new Story({
				creator: req.decoded.id,
				content: req.body.content,
			})

			story.save(function(err){
				if (err) {
					res.send(err);
					return
				}

				res.json({message: 'New Story Created!'});
			})
		})

		.get(function(req, res){
			Story.find({creator: req.decoded.id}, function(err, stories){
				if (err) {
					res.send(err);
					return
				}

				res.json(stories)
			})
		})

	api.get('/me', function(req, res){
		console.log("Body: ",req.body);
		console.log("Decod: ",req.decoded);
		res.json(req.decoded);
	})


	return api;
}



