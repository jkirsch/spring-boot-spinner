angular.module('spinner.controllers', ['spinner.services', 'toaster'])


.controller('EntriesCtrl', function($scope, myService, toaster, $timeout, $log, $window, $translate) {

    'use strict';

    var socket;
    var stompClient;

    $scope.participants = [];

    $scope.winner = '';
    $scope.newName = '';

    $scope.connected = 0;

    $scope.spinning = false;

	$scope.add = function (newName) {

        var newEntry = {
            name : $scope.newName.trim()
        };

        toaster.clear('*');
        myService.create(newEntry).then(function(d) {
            $scope.newName = '';
        },
        function(errorObject) {
            toaster.pop('error', 'Backend error', errorObject.message);
            $log.log(errorObject);
        });

	};

   var handleAdd = function(added) {
        $scope.participants.push(added);
        // add
        updateDisplay();
   };

   var updateDisplay = function(removed) {
       if (!$scope.spinning) {
           wheel.update(transform());
           // add
           $scope.$apply();
       }
   };

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
        updateDisplay();

   };

   var handleCount = function(count) {
        // update the count handler
        $scope.connected = count;
        updateDisplay();
   };

   var handleRandomSpin = function(element) {

        // an item was select. find the index

       $scope.spinning = true;

        var i;
        for (i = 0; i < $scope.participants.length; i++) {
          if ($scope.participants[i].id === element.id) {
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
            $scope.participants[i] = element;
            $scope.spinning = false;
            $scope.$apply();
            $translate(['WINNER']).then(function (translations) {
                toaster.pop('success', translations.WINNER, element.name);
            });
        }, spinResult.duration);

   };

    var initialConnect = function(frame) {
          $log.log('Connected ' + frame);

          stompClient.subscribe("/app/participants", function(message) {
            var res = angular.fromJson(message.body);
            $scope.participants = res.entries;
            $scope.connected = res.connected;
            updateDisplay();
          });

          stompClient.subscribe("/topic/added", function(message) {
            handleAdd(angular.fromJson(message.body));
          });

          stompClient.subscribe("/topic/deleted", function(message) {
            handleRemove(angular.fromJson(message.body));
          });

          stompClient.subscribe("/topic/spin", function(message) {
            handleRandomSpin(angular.fromJson(message.body));
          });

          stompClient.subscribe("/topic/count", function(message) {
            handleCount(angular.fromJson(message.body));
          });

    };

        var stompFailureCallback = function (error) {
            // set the handler to 0
            handleCount(0);
            $log.log('STOMP: ' + error);
            $timeout(stompConnect, 10000);
            $log.log('STOMP: Reconnecting in 10 seconds');
        };

        function stompConnect() {
            $log.log('STOMP: Attempting connection');
            // recreate the stompClient to use a new WebSocket
            socket = new SockJS('/spinner');
            stompClient = Stomp.over(socket);
            stompClient.connect({}, initialConnect, stompFailureCallback);
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
    };

  var wheelWidth = Math.min($window.innerWidth / 2, 220) - 20;

   var wheel = new Spinner("#spinnerContainer", {
        margins: {top: 40, right: 10, bottom: 10, left: 10},
        outerR: wheelWidth ,
        h: 450,
        w: 2*wheelWidth + 20,
        data: transform()
    });

    $scope.spin = function() {

        toaster.clear('*');
        myService.spin().then(function(d) {
            $scope.winner = '';
        },
        function(errorObject) {
            toaster.pop('error', 'Backend error', errorObject.message);
            $log.log(errorObject);
        });
    };

    $scope.info = function () {
        $translate('CLIENTS', {clients: $scope.connected}).then(function (translation) {
            toaster.pop('info', 'Clients', translation);
            });
    };


});