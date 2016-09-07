angular.module('userCtrl', ['userService'])

.controller('UserController', function(User){

	var that = this;

	User.all()
		.success(function(data){
			that.users = data;
		})
})

.controller('CreateUserController', function(User, $location, $window){
	var that = this;

	that.signup = function(){
		console.log(that.userData);
		User.create(that.userData)
			.then(function(res){
				console.log("res: ", res.data);
				that.userData = {};
				that.message = res.data.message;

				$window.localStorage.setItem('token', res.data.token);
				$location.path('/');
			})
			.error(function(err){
				console.log("err:", err);
			})
	}
})