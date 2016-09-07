angular.module('authService', [])

.factory('Auth', function($http, $q, AuthToken) {
	var authFactory = {};

	authFactory.login = function(username, password){
		return $http.post('/api/login', {
			username: username,
			password: password
		}).success(function(data){
			console.log(data)
			AuthToken.setToken(data.token)
			return data;
		})
	}

	authFactory.logout = function(){
		AuthToken.setToken();
	}

	authFactory.isloggedIn = function(){
		if (AuthToken.getToken()) {
			return true;
		}else{
			return false;
		}
	}

	authFactory.getUser = function(){
		if(AuthToken.getToken()){
			 return $http.get('/api/me');
		}else{
			return $q.reject({
				message: "User has no token!"
			})
		}
	}

	return authFactory;
})

.factory('AuthToken', function($window){
	var authTokenFactory = {}

	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token');
	}

	authTokenFactory.setToken = function(token){
		if (token) {
			$window.localStorage.setItem('token', token)
		}else{
			$window.localStorage.removeItem('token');
		}
	}

	return authTokenFactory;
})

.factory('AuthInterceptor', function($q, $location, AuthToken) {
	

  
	var interceptorFactory = {};

	interceptorFactory.request = function(config){
		var token = AuthToken.getToken();
		if (token){
			config.headers['x-access-token'] = token
		}
		return config;
	}

	interceptorFactory.responseError = function(res){
		if (res.status === 403) {
			$location.path('/login');
		}

		return $q.reject(res);
	}

	return interceptorFactory;

// return {
//     // optional method
//     'request': function(config) {
//       // do something on success
//       return config;
//     },

//     // optional method
//    'requestError': function(rejection) {
//       // do something on error
//       if (canRecover(rejection)) {
//         return responseOrNewPromise
//       }
//       return $q.reject(rejection);
//     },



//     // optional method
//     'response': function(response) {
//       // do something on success
//       return response;
//     },

//     // optional method
//    'responseError': function(rejection) {
//       // do something on error
//       if (canRecover(rejection)) {
//         return responseOrNewPromise
//       }
//       return $q.reject(rejection);
//     }
// };
})