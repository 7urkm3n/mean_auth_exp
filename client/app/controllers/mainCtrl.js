angular.module('mainCtrl', [])

.controller('MainController', function($rootScope, $location, Auth){
	var that = this;

	// that.loggedIn = Auth.isloggedIn();

	$rootScope.$on('$routeChangeStart', function(){
		that.loggedIn = Auth.isloggedIn();

		Auth.getUser()
			.then(function(data){
				that.user = data.data
			});
	})

	that.login = function(){
		that.processing = true;
		that.error = '';

		Auth.login(that.loginData.username, that.loginData.password)
			.success(function(data){
				that.processing = false;

				Auth.getUser()
					.then(function(data){
						that.user = data.data
					});
				if (data.success) {
					$location.path('/');
				}else{
					that.error = data.message; 
				}
			});
	}

	that.logout = function(){
		Auth.logout();
		$location.path('/');
		$location.path('/');
	}


})