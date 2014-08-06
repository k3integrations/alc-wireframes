var app;

Holder.add_theme('dark', {
  background: 'hsl(0,0%,15%)',
  foreground: 'hsl(0,0%,22%)',
  size: '11',
  font: 'Helvetica Neue,Helvetica,sans-serif',
  fontweight: 'lighter'
}).run();

app = angular.module('ALC', ['mm.foundation', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  'use strict';
  $urlRouterProvider.otherwise('/');
  return $stateProvider.state('home', {
    url: '/',
    templateUrl: 'partials/home.html'
  }).state('register', {
    url: '/register',
    templateUrl: 'partials/register.html'
  });
});

//# sourceMappingURL=maps/main.js.map
'use strict';

angular.module('ALC').directive('alcHolder', function() {
  return {
    link: function(scope, element, attrs) {
      attrs.$set('data-src', attrs.alcHolder);
      Holder.run({images:element.get(0), nocss:true});
    }
  };
});

angular.module('ALC').controller('registerCtrl', function ($scope) {
  'use strict';

  $scope.states = [
    'start',
    'student.id',
    'name',
    'dob',
    'email',
    'password',
    'avatar'
  ];

  $scope.currentStateIndex = 0;

  $scope.currentState      = function ()  { return $scope.states[$scope.currentStateIndex]; };
  $scope.nextState         = function ()  { $scope.currentStateIndex += 1; };
  $scope.previousState     = function ()  { $scope.currentStateIndex -= 1; };
});
