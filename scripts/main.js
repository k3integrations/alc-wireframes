/* global angular */

var app = angular.module('ALC', ['mm.foundation', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  'use strict';

  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'partials/home.html'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'partials/register.html'
    });
});

'use strict';

angular.module('ALC').directive('alcHolder', function() {
  return {
    link: function(scope, element, attrs) {
      attrs.$set('data-src', attrs.alcHolder);
      Holder.run(element);
    }
  };
});

angular.module('ALC').controller('registerCtrl', function ($scope) {
  'use strict';

  $scope.states = [
    'start',
    'step1',
    'step2',
    'step3',
    'step4',
    'step5',
    'step6',
    'step7'
  ];

  $scope.currentStateIndex = 0;

  $scope.currentState      = function ()  { return $scope.states[$scope.currentStateIndex]; };
  $scope.nextState         = function ()  { $scope.currentStateIndex += 1; };
  $scope.previousState     = function ()  { $scope.currentStateIndex -= 1; };
});
