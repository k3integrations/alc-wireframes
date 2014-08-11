var app;

Holder.add_theme('wf-dark', {
  background: '#555',
  foreground: '#777',
  size: '11',
  font: 'Helvetica Neue, Helvetica, sans-serif',
  fontweight: 'lighter'
}).add_theme('wf', {
  background: '#888',
  foreground: '#aaa',
  size: '11',
  font: 'Helvetica Neue, Helvetica, sans-serif',
  fontweight: 'lighter'
}).add_theme('wf-blank', {
  background: '#888',
  foreground: '#888',
  size: '11',
  font: 'Helvetica Neue, Helvetica, sans-serif',
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
  }).state('dashboard', {
    url: '/dashboard',
    templateUrl: 'partials/dashboard.html'
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

angular.module('ALC').directive('alcFormProgressItem', function() {
  return {
    templateUrl: 'partials/directives/formProgressItem.html',
    transclude: true,
    scope: {
      title: "@",
      step: "@alcFormProgressItem"
    },
    link: function(scope, element, attrs) {
      scope.registrant = scope.$parent.registrant;
      return scope.$watch('step', function(step) {
        if (scope.registrant[step] != null) {
          return attrs.$removeClass('ng-hide');
        } else {
          return attrs.$addClass('ng-hide');
        }
      });
    }
  };
});

//# sourceMappingURL=../maps/directives/formProgressItem.js.map
angular.module('ALC').controller('registerCtrl', function($scope) {
  'use strict';
  var state, _i, _len, _ref;
  $scope.registrant = {};
  $scope.form = {};
  $scope.states = ['role', 'studentId', 'name', 'dob', 'email', 'password', 'avatar', 'confirm'];
  _ref = $scope.states;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    state = _ref[_i];
    $scope.registrant[state] = '';
  }
  $scope.currentStateIndex = 0;
  $scope.currentState = function() {
    return $scope.states[$scope.currentStateIndex];
  };
  $scope.nextState = function() {
    return $scope.currentStateIndex += 1;
  };
  $scope.previousState = function() {
    return $scope.currentStateIndex -= 1;
  };
  $scope.months = moment.months();
  return $scope.dobChanged = function() {
    var date, dob;
    date = [$scope.form.year, $scope.form.month, $scope.form.day].join('-');
    dob = moment(date);
    if (dob.isValid() && $scope.form.year) {
      return $scope.registrant.dob = dob;
    }
  };
});

//# sourceMappingURL=../maps/controllers/register.js.map
angular.module('ALC').filter('passwordDots', function() {
  return function(input) {
    if (input == null) {
      input = '';
    }
    return input.split('').map((function(m) {
      return "\u2022";
    })).join('');
  };
});

//# sourceMappingURL=../maps/filters/passwordDots.js.map