
var myApp = angular.module('spinner.services', [

])

.factory('myService', function($http) {
    var myService = {
        create: function(data) {
          // $http returns a promise, which has a then function, which also returns a promise
          var promise = $http.post('participants/', data).then(function (response) {
            // The then function here is an opportunity to modify the response
            // We select the JSON parsed response data
            // The return value gets picked up in the controller.
            return response.data;
          }, function(data, status, headers, config) {
              // error handling
                var text;
                if(data.data) {
                    text = data.data.message;
                }
                throw new Error(text || "Can't talk to server - server down?");
          });
          // Return the promise to the controller
          return promise;
        },
        spin: function() {
          // $http returns a promise, which has a then function, which also returns a promise
          var promise = $http.get('participants/random').then(function (response) {
            // The then function here is an opportunity to modify the response
            // We select the JSON parsed response data
            // The return value gets picked up in the controller.
            return response.data;
          }, function(data, status, headers, config) {
              // error handling
                var text;
                if(data.data) {
                    text = data.data.message;
                }
                throw new Error(text || "Can't talk to server - server down?");
          });
          // Return the promise to the controller
          return promise;
        }
      };
      return myService;
});