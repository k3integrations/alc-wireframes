(function() {
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

  app = angular.module('ALC', ['mm.foundation', 'ui.router', 'ngDropzone', 'ui.utils', 'ngAnimate', 'ui.select2']);

  app.config(function($stateProvider, $urlRouterProvider) {
    'use strict';
    $urlRouterProvider.otherwise('/');
    return $stateProvider.state('home', {
      url: '/',
      templateUrl: 'partials/home.html'
    }).state('register', {
      url: '/register',
      templateUrl: 'partials/register.html'
    }).state('register-complete', {
      controller: function($state, $rootScope, $scope) {
        $rootScope.user = $scope.$parent.registrant;
        return $state.go('dashboard');
      }
    }).state('dashboard', {
      url: '/dashboard',
      templateUrl: 'partials/dashboard.html',
      controller: function($rootScope) {
        return $rootScope.header = 'logged-in-header';
      }
    }).state('logout', {
      controller: function($state, $rootScope) {
        $rootScope.header = void 0;
        return $state.go('home');
      }
    }).state('resources', {
      url: '/resources',
      templateUrl: 'partials/resources.html'
    });
  });

}).call(this);

//# sourceMappingURL=maps/main.js.map
(function() {
  'use strict';
  angular.module('ALC').directive('alcHolder', function() {
    return {
      link: function(scope, element, attrs) {
        attrs.$set('data-src', attrs.alcHolder);
        return Holder.run({
          images: element.get(0),
          nocss: true
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=../maps/directives/holder.js.map
(function() {
  angular.module('ALC').directive('alcFormProgressItem', function() {
    return {
      templateUrl: 'partials/directives/formProgressItem.html',
      transclude: true,
      scope: {
        title: "@",
        step: "@alcFormProgressItem"
      },
      link: function(scope, element, attrs) {
        var setVisibility;
        scope.containsState = function(state) {
          return !!~scope.$parent.states.indexOf(state);
        };
        setVisibility = function() {
          if (scope.containsState(scope.step)) {
            return attrs.$removeClass('ng-hide');
          } else {
            return attrs.$addClass('ng-hide');
          }
        };
        scope.$watch('step', setVisibility);
        return scope.$parent.$watchCollection('states', setVisibility);
      }
    };
  });

}).call(this);

//# sourceMappingURL=../maps/directives/formProgressItem.js.map
(function() {
  angular.module('ALC').directive('alcStopClickPropagation', function() {
    return {
      link: function(scope, element, attrs) {
        return element.on('click', function(e) {
          return e.stopPropagation();
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=../maps/directives/stopClickPropagation.js.map
(function() {
  angular.module('ALC').directive('alcMarkWhenTop', function() {
    return {
      link: function(scope, element, attrs) {
        var isAtTop, setClass;
        isAtTop = function() {
          return element.scrollTop() === 0;
        };
        setClass = function() {
          if (isAtTop()) {
            attrs.$addClass('at-top');
            return attrs.$removeClass('not-at-top');
          } else {
            attrs.$addClass('not-at-top');
            return attrs.$removeClass('at-top');
          }
        };
        setClass();
        return element.on('scroll', setClass);
      }
    };
  });

}).call(this);

//# sourceMappingURL=../maps/directives/markWhenTop.js.map
(function() {
  angular.module('ALC').directive('alcFocusInputOnload', function() {
    return {
      link: function(scope, element, attrs) {
        return scope.$on('$includeContentLoaded', function() {
          return element.find('select, input').filter(':visible').first().focus();
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=../maps/directives/focusInputOnload.js.map
(function() {
  angular.module('ALC').directive('alcExitOffCanvas', function() {
    return {
      require: '^offCanvasWrap',
      restrict: 'AC',
      link: function($scope, element, attrs, offCanvasWrap) {
        return element.on('click', function() {
          return offCanvasWrap.hide();
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=../maps/directives/exitOffCanvas.js.map
(function() {
  angular.module('ALC').controller('registerCtrl', function($scope, $http, $state) {
    'use strict';
    var formData, formIsValid, isCurrentlyValid;
    $scope.roleStates = {
      'student': ['role', 'studentId', 'name', 'dob', 'email', 'password', 'avatar', 'confirm'],
      'teacher': ['role', 'teacherId', 'name', 'dob', 'email', 'password', 'avatar', 'confirm'],
      'pastor': ['role', 'churchIds', 'name', 'email', 'password', 'avatar', 'confirm'],
      'org leader': ['role', 'adminRole', 'orgId', 'name', 'dob', 'email', 'password', 'avatar', 'confirm'],
      'edu org leader': ['role', 'adminRole', 'edToolkitLogin', 'password', 'avatar', 'confirm'],
      'min org leader': ['role', 'adminRole', 'orgId', 'name', 'dob', 'email', 'password', 'avatar', 'confirm'],
      'person': ['role', 'churchId', 'name', 'email', 'password', 'avatar', 'confirm']
    };
    $scope.swapCurrentState = function(newState) {
      var idx;
      idx = $scope.currentStateIndex();
      return $scope.currentState = $scope.states[idx] = newState;
    };
    $scope.form = {};
    $scope.registrant = {};
    $scope.validStates = {};
    $scope.setStates = function(role, rewind) {
      var states;
      if (rewind == null) {
        rewind = true;
      }
      states = $scope.roleStates[role];
      if (states == null) {
        return;
      }
      $scope.states = states;
      if (rewind) {
        return $scope.currentState = $scope.states[0];
      }
    };
    $scope.avatarThumb = function(file, dataURI) {
      $scope.registrant.avatarURI = dataURI;
      $scope.registrant.avatar = file;
      return $scope.$digest();
    };
    isCurrentlyValid = function() {
      return $scope.validStates[$scope.currentState];
    };
    $scope.currentStateIndex = function() {
      return $scope.states.indexOf($scope.currentState);
    };
    $scope.nextState = function(e) {
      var nextIndex;
      if (e != null) {
        e.preventDefault();
      }
      nextIndex = $scope.currentStateIndex() + 1;
      $scope.setValidity();
      if (nextIndex < $scope.states.length) {
        if (isCurrentlyValid()) {
          return $scope.currentState = $scope.states[nextIndex];
        }
      } else {
        return $scope.submitForm();
      }
    };
    $scope.previousState = function(e) {
      var prevIndex;
      if (e != null) {
        e.preventDefault();
      }
      prevIndex = $scope.currentStateIndex() - 1;
      if (prevIndex > -1) {
        return $scope.currentState = $scope.states[prevIndex];
      }
    };
    $scope.goTo = function(state) {
      if (~$scope.states.indexOf(state)) {
        return $scope.currentState = state;
      }
    };
    $scope.nextIncompleteState = function() {
      var state, _i, _len, _ref;
      _ref = $scope.states;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        state = _ref[_i];
        if (!$scope.validStates[state]) {
          return state;
        }
      }
    };
    $scope.months = moment.months();
    $scope.dobChanged = function() {
      var date, dob;
      date = [$scope.form.year, $scope.form.month, $scope.form.day].join('-');
      dob = moment(date);
      if (dob.isValid() && $scope.form.year) {
        return $scope.registrant.dob = dob;
      }
    };
    $http.get('api/schools.json').then(function(result) {
      return $scope.schools = result.data;
    });
    $http.get('api/churches.json').then(function(result) {
      return $scope.churches = result.data;
    });
    $http.get('api/unions_and_conferences.json').then(function(result) {
      return $scope.orgs = result.data;
    });
    $scope.nameForId = function(collection, selectedId) {
      var item, _i, _len;
      for (_i = 0, _len = collection.length; _i < _len; _i++) {
        item = collection[_i];
        if (item.id === parseInt(selectedId)) {
          return item.text;
        }
      }
    };
    $scope.setValidity = function() {
      return $scope.validStates[$scope.currentState] = $scope.regForm.$valid;
    };
    $scope.$watch('regForm.$valid', $scope.setValidity);
    $scope.$watch('registrant.role', function(role) {
      return $scope.setStates(role, false);
    });
    $scope.$watch('registrant.adminRole', function(role) {
      $scope.registrant.role = role;
      return $scope.setStates(role, false);
    });
    $scope.setStates('student');
    formIsValid = function() {
      var stateValue, _i, _len, _ref;
      _ref = $scope.states;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stateValue = _ref[_i];
        if ($scope.validStates[stateValue] === false) {
          return false;
        }
      }
      return true;
    };
    formData = function() {
      var data, stateValue, value, _i, _len, _ref;
      data = {};
      _ref = $scope.states;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stateValue = _ref[_i];
        value = $scope.registrant[stateValue];
        if (value) {
          data[stateValue] = value;
        }
      }
      return data;
    };
    return $scope.submitForm = function(event) {
      if (event) {
        event.preventDefault();
      }
      $http.post('users', formData());
      if (formIsValid()) {
        return $state.go('register-complete');
      }
    };
  });

}).call(this);

//# sourceMappingURL=../maps/controllers/register.js.map
(function() {
  angular.module('ALC').controller('searchCtrl', function($scope, $http, $state, $rootScope) {
    $scope.doSearch = function() {
      $rootScope.searchQuery = $scope.query;
      return $state.go('resources');
    };
    $scope.query || ($scope.query = $rootScope.searchQuery);
    return $http.get('api/search_results.json').then(function(response) {
      return $scope.results = response.data;
    });
  });

}).call(this);

//# sourceMappingURL=../maps/controllers/search.js.map
(function() {
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

}).call(this);

//# sourceMappingURL=../maps/filters/passwordDots.js.map
(function() {
  angular.module('ALC').filter('emailShortener', function() {
    return function(email) {
      var first, last, lastParts, part, _ref;
      if (email == null) {
        email = "";
      }
      _ref = email.split("@"), first = _ref[0], last = _ref[1];
      if (!last) {
        return email;
      }
      lastParts = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = last.split('.');
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          part = _ref1[_i];
          if (part.length > 4) {
            _results.push(part.slice(0, 3) + '…');
          } else {
            _results.push(part);
          }
        }
        return _results;
      })();
      first = first.length > 7 ? first.slice(0, 3) + "…" + first.slice(first.length - 3, +first.length + 1 || 9e9) : first;
      return first + "@" + lastParts.join('.');
    };
  });

}).call(this);

//# sourceMappingURL=../maps/filters/emailShortener.js.map