'use strict';

angular.module('spinner.controllers', ['spinner.services', 'toaster'])


.controller('EntriesCtrl', function($scope, myService, toaster, $timeout) {

    var socket = new SockJS('/spinner');
    var stompClient = Stomp.over(socket);

    $scope.participants = [];

    $scope.winner = "";
    $scope.newName = '';

	$scope.add = function (newName) {

        var newEntry = {
            name : $scope.newName.trim()
        };

        toaster.clear();
        myService.create(newEntry).then(function(d) {
            $scope.newName = '';
        },
        function(errorObject) {
            toaster.pop('error', "Backend error", errorObject.message);
            console.log(errorObject);
        })

	};

   var handleAdd = function(added) {
        $scope.participants.push(added);
        $scope.$apply();
   }

   var handleRemove = function(removed) {

        // an item was removed. find the index
        var i;
        for (i = 0; i < $scope.participants.length; i++) {
          if ($scope.participants[i].id === removed) {
            break;
          }
        }
        // i is now the index
        $scope.participants.splice(i , 1);
        $scope.$apply();

   }

   var handleRandomSpin = function(element) {

        // an item was select. find the index
        var i;
        for (i = 0; i < $scope.participants.length; i++) {
          if ($scope.participants[i].id === element.id) {
            $scope.participants[i] = element
            break;
          }
        }
        // i is now the index

        // spin the wheel
        wheel.update(transform());

        // the spinning degree = the selected element of the index
        // the i-th element is the one we are interested in

        // where it needs to stop is on slice - i

        var reverse = ($scope.participants.length - i) -1;

        var slice = reverse  * (360 / $scope.participants.length) + 360 + (360 / $scope.participants.length) / 2;

        // number of spins =  10
        var deg = slice + 360 * 20;
        var spinResult = wheel.spin(deg);

        $timeout(function() {
            $scope.winner = element;
            $scope.$apply();
        }, spinResult.duration);

   }

    var initialConnect = function(frame) {
          console.log('Connected ' + frame);

          stompClient.subscribe("/app/participants", function(message) {
            $scope.participants = JSON.parse(message.body);
            $scope.$apply();
          });

          stompClient.subscribe("/topic/added", function(message) {
            handleAdd(JSON.parse(message.body));
          });

          stompClient.subscribe("/topic/deleted", function(message) {
            handleRemove(JSON.parse(message.body));
          });

          stompClient.subscribe("/topic/spin", function(message) {
            handleRandomSpin(JSON.parse(message.body));
          });
    }

    function stompConnect() {
        console.log('Attempting to connect');
        stompClient.connect({}, initialConnect, function(error) {
                  console.log('STOMP: ' + error);
                  setTimeout(stompConnect, 15000);
                  console.log('STOMP: Reconnecting in 10 seconds');
                });
    }

    stompConnect();

    $scope.remove = function (element) {
        stompClient.send("/app/remove", {}, JSON.stringify(element.id));
    };


    var transform = function() {
        var transformed = [];
        angular.forEach($scope.participants, function(value) {
          this.push(value.name.substring(0,8));
        }, transformed);
        return transformed;
    }

   var wheel = new Spinner("#spinnerContainer", {
        margins: {top: 40, right: 10, bottom: 10, left: 10},
        outerR: Math.min(window.innerWidth / 2, 220) - 20,
        h: 450,
        w: 600,
        data: transform()
    });

    $scope.spin = function() {

        toaster.clear();
        myService.spin().then(function(d) {
            $scope.winner = "";
        },
        function(errorObject) {
            toaster.pop('error', "Backend error", errorObject.message);
            console.log(errorObject);
        })
    }


});