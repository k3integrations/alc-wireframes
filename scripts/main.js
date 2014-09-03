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

  app = angular.module('ALC.Base', ['mm.foundation', 'ngDropzone', 'ui.utils', 'ngAnimate', 'ui.select2']);

}).call(this);

//# sourceMappingURL=../maps/alc-base/main.js.map
(function() {
  angular.module('ALC.Base').controller('registerCtrl', function($scope, $http, $state) {
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
    $http.get('schools').then(function(result) {
      return $scope.schools = result.data;
    });
    $http.get('churches').then(function(result) {
      return $scope.churches = result.data;
    });
    $http.get('unions_and_conferences').then(function(result) {
      return $scope.orgs = result.data;
    });
    $scope.nameForId = function(collection, selectedId) {
      var item, _i, _len;
      for (_i = 0, _len = collection.length; _i < _len; _i++) {
        item = collection[_i];
        if (item.id === parseInt(selectedId)) {
          return item.name;
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

//# sourceMappingURL=../../maps/alc-base/controllers/register.js.map
(function() {
  angular.module('ALC.Base').controller('searchCtrl', function($scope, $http, $state, $rootScope) {
    $scope.doSearch = function() {
      $rootScope.searchQuery = $scope.query;
      return $state.go('search');
    };
    $scope.query || ($scope.query = $rootScope.searchQuery);
    $scope.filters = {
      categories: {
        all: true
      },
      audiences: {
        all: true
      },
      file_types: {
        all: true
      }
    };
    $scope.defaultLimit = 5;
    $http.get('schools', {
      params: {
        count: 10
      }
    }).then(function(response) {
      return $scope.schools = response.data;
    });
    return $http.get('search_results', {
      params: {
        query: $scope.query
      }
    }).then(function(response) {
      return $scope.results = response.data;
    });
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-base/controllers/search.js.map
(function() {
  var base;

  base = angular.module('ALC.Base');

  base.directive('alcCheckboxGroup', function() {
    return {
      scope: {
        group: "=alcCheckboxGroup"
      },
      controller: function() {
        this.group = null;
        this.setGroup = function(group) {
          return this.group = group;
        };
        this.clearOthers = function() {
          var item, _results;
          _results = [];
          for (item in this.group) {
            _results.push(this.group[item] = false);
          }
          return _results;
        };
      },
      link: function(scope, element, attrs, checkboxCtrl) {
        var changeGroup;
        changeGroup = function(group) {
          var anyChecked, category, value;
          checkboxCtrl.setGroup(group);
          anyChecked = false;
          for (category in group) {
            value = group[category];
            if (category !== 'all' && value === true) {
              anyChecked = true;
            }
          }
          return group.all = !anyChecked;
        };
        scope.$watch('group', changeGroup, true);
        return changeGroup(scope.group);
      }
    };
  });

  base.directive('alcCheckboxGroupAll', function() {
    return {
      require: '^alcCheckboxGroup',
      link: function(scope, element, attrs, checkboxCtrl) {
        return element.on('change', function() {
          return checkboxCtrl.clearOthers();
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-base/directives/checkboxGroup.js.map
(function() {
  angular.module('ALC.Base').directive('alcExitOffCanvas', function() {
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

//# sourceMappingURL=../../maps/alc-base/directives/exitOffCanvas.js.map
(function() {
  angular.module('ALC.Base').directive('alcFocusInputOnload', function() {
    return {
      link: function(scope, element, attrs) {
        return scope.$on('$includeContentLoaded', function() {
          return element.find('select, input').filter(':visible').first().focus();
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-base/directives/focusInputOnload.js.map
(function() {
  angular.module('ALC.Base').directive('alcFormProgressItem', function() {
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

//# sourceMappingURL=../../maps/alc-base/directives/formProgressItem.js.map
(function() {
  'use strict';
  angular.module('ALC.Base').directive('alcHolder', function() {
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

//# sourceMappingURL=../../maps/alc-base/directives/holder.js.map
(function() {
  angular.module('ALC.Base').directive('alcMarkWhenTop', function() {
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

//# sourceMappingURL=../../maps/alc-base/directives/markWhenTop.js.map
(function() {
  var base;

  base = angular.module('ALC.Base');

  base.directive('alcResultSection', function() {
    return {
      scope: true,
      controller: function($scope) {
        this.increment = function(incrementCount) {
          if (incrementCount == null) {
            incrementCount = 0;
          }
          $scope.$alcResultLimit = $scope.$alcResultLimit + incrementCount;
          return $scope.$digest();
        };
      },
      link: function(scope, element, attrs, resultSectionCtrl) {
        return scope.$alcResultLimit = scope.$eval(attrs.alcResultSection);
      }
    };
  });

  base.directive('alcResultSectionMore', function() {
    return {
      scope: {
        incrementAmount: "=alcResultSectionMore"
      },
      require: '^alcResultSection',
      link: function(scope, element, attrs, resultSectionCtrl) {
        return element.bind('click', function() {
          return resultSectionCtrl.increment(scope.incrementAmount || 5);
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-base/directives/resultSection.js.map
(function() {
  angular.module('ALC.Base').directive('alcStopClickPropagation', function() {
    return {
      link: function(scope, element, attrs) {
        return element.on('click', function(e) {
          return e.stopPropagation();
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-base/directives/stopClickPropagation.js.map
(function() {
  angular.module('ALC.Base').filter('emailShortener', function() {
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

//# sourceMappingURL=../../maps/alc-base/filters/emailShortener.js.map
(function() {
  angular.module('ALC.Base').filter('passwordDots', function() {
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

//# sourceMappingURL=../../maps/alc-base/filters/passwordDots.js.map
(function() {
  angular.module('ALC.Base').factory('$state', function() {
    return {
      go: function(name) {
        return window.location.pathname = '/' + name;
      }
    };
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-base/services/state.js.map
(function() {
  (function($) {
    var createElement, decode, re;
    re = /([^&=]+)=?([^&]*)/g;
    decode = function(str) {
      return decodeURIComponent(str.replace(/\+/g, ' '));
    };
    createElement = function(params, key, value) {
      var index, list, new_key;
      if (params == null) {
        params = {};
      }
      key = "" + key;
      if (key.indexOf('.') !== -1) {
        list = key.split('.');
        new_key = key.split(/\.(.+)?/)[1];
        if (!params[list[0]]) {
          params[list[0]] = {};
        }
        if (new_key !== '') {
          return createElement(params[list[0]], new_key, value);
        } else {
          return console.warn("parseParams :: empty property in key '" + key + "'");
        }
      } else if (key.indexOf('[') !== -1) {
        list = key.split('[');
        key = list[0];
        list = list[1].split(']');
        index = list[0];
        if (!params[key] || !$.isArray(params[key])) {
          params[key] = [];
        }
        if (index === '') {
          return params[key].push(value);
        } else {
          return params[key][parseInt(index)] = value;
        }
      } else {
        return params[key] = value;
      }
    };
    return $.parseParams = function(query) {
      var e, key, params, value;
      query = "" + (query != null ? query : window.location);
      params = {};
      e = void 0;
      if (query !== '') {
        if (query.indexOf('#') !== -1) {
          query = query.substr(0, query.indexOf('#'));
        }
        if (query.indexOf('?') !== -1) {
          query = query.substr(query.indexOf('?') + 1, query.length);
        }
        if (query !== '') {
          while (e = re.exec(query)) {
            key = decode(e[1]);
            value = decode(e[2]);
            createElement(params, key, value);
          }
        }
      }
      return params;
    };
  })(jQuery);

}).call(this);

//# sourceMappingURL=../maps/alc-wire/jquery.parseParams.js.map
(function() {
  var app;

  app = angular.module('ALC.Wire', ['ALC.Base', 'ui.router', 'ngMockE2E']);

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
      url: '/search/resources',
      templateUrl: 'partials/search-results.html'
    }).state('search', {
      url: '/search',
      templateUrl: 'partials/search-results.html'
    });
  });

}).call(this);

//# sourceMappingURL=../maps/alc-wire/main.js.map
(function() {
  angular.module('ALC.Wire').run(function($httpBackend) {
    var A, L, R, capitalizeStr, capitalizeText, churchName, conferenceName, idNum, ids, makeChurch, makeCollection, makeConference, makeContentPage, makeCourse, makeResource, makeSchool, makeSchools, makeSearchResult, makeUnion, makeUnionOrConference, schoolName, sentences, titleCaseText, unionName, words, _churches_, _schools_, _searchResults_, _unionsAndConferences_;
    _churches_ = null;
    _schools_ = null;
    _unionsAndConferences_ = null;
    _searchResults_ = null;
    $httpBackend.whenGET(/^partials\//).passThrough();
    $httpBackend.whenGET(/^schools/).respond(function(method, url, data) {
      var params;
      params = $.parseParams(url);
      makeSchools(params.count || 100);
      return [200, _schools_, {}];
    });
    $httpBackend.whenGET(/^churches/).respond(function(method, url, data) {
      var params;
      params = $.parseParams(url);
      _churches_ || (_churches_ = makeCollection(makeChurch, params.count || 100));
      return [200, _churches_, {}];
    });
    $httpBackend.whenGET(/^unions_and_conferences/).respond(function(method, url, data) {
      var params;
      params = $.parseParams(url);
      _unionsAndConferences_ || (_unionsAndConferences_ = makeCollection(makeUnionOrConference, params.count || 100));
      return [200, _unionsAndConferences_, {}];
    });
    $httpBackend.whenGET(/^search_results/).respond(function(method, url, data) {
      var params;
      params = $.parseParams(url);
      console.log(params);
      _searchResults_ || (_searchResults_ = makeCollection(makeSearchResult, params.count || 300));
      return [200, _searchResults_, {}];
    });
    makeCollection = function(generator, count) {
      var collection, i, _i;
      collection = [];
      for (i = _i = 1; 1 <= count ? _i <= count : _i >= count; i = 1 <= count ? ++_i : --_i) {
        collection.push(generator());
      }
      return collection;
    };
    makeSchools = function(count) {
      return _schools_ || (_schools_ = makeCollection(makeSchool, count));
    };
    A = faker.Address;
    L = faker.Lorem;
    R = faker.random;
    sentences = function(count) {
      return L.sentences(count).split("\n").join('. ');
    };
    words = function(count) {
      return L.words(count).join(' ');
    };
    titleCaseText = function(text) {
      return text.replace(/\w\S*/g, capitalizeStr);
    };
    capitalizeText = function(text) {
      return text.replace(/\w[^\.\?\!]*/g, capitalizeStr);
    };
    capitalizeStr = function(str) {
      return str.charAt(0).toUpperCase() + str.substr(1);
    };
    ids = {};
    idNum = function(scope) {
      var id;
      ids[scope] || (ids[scope] = []);
      id = R.number(1000000);
      while (ids[scope].indexOf(id) > -1) {
        id = R.number(1000000);
      }
      ids[scope].push(id);
      return id;
    };
    schoolName = function() {
      var city, middle, suffix;
      city = A.city();
      middle = R.array_element(['', 'Adventist']);
      suffix = R.array_element(['University', 'College', 'Adventist University']);
      return ("" + city + " " + middle + " " + suffix).replace(/\s+/g, ' ');
    };
    churchName = function() {
      var city, middle;
      city = A.city();
      middle = R.array_element(['SDA', 'Adventist', 'Seventh-day Adventist']);
      return "" + city + " " + middle + " Church";
    };
    conferenceName = function() {
      return "" + (A.usState()) + " Conference";
    };
    unionName = function() {
      return "" + (A.usState()) + " Union";
    };
    makeSchool = function() {
      return {
        id: idNum('school'),
        name: schoolName()
      };
    };
    makeChurch = function() {
      return {
        id: idNum('church'),
        name: churchName()
      };
    };
    makeUnionOrConference = function() {
      return R.array_element([makeUnion, makeConference])();
    };
    makeUnion = function() {
      return {
        id: idNum('org'),
        name: unionName()
      };
    };
    makeConference = function() {
      return {
        id: idNum('org'),
        name: conferenceName()
      };
    };
    makeSearchResult = function() {
      return R.array_element([makeCourse, makeResource, makeContentPage])();
    };
    makeCourse = function() {
      makeSchools(10);
      return {
        id: idNum('course'),
        type: 'Course',
        title: titleCaseText(words(R.number(1, 6))),
        description: capitalizeText(sentences(R.number(1, 3))),
        audience: R.array_element(['student', 'teacher', 'pastor']),
        coreCompetency: R.array_element(['one', 'two', 'three', 'four', 'five']),
        offeredBy: R.array_element(_schools_)
      };
    };
    makeResource = function() {
      return {
        id: idNum('resource'),
        type: 'Resource',
        title: titleCaseText(words(R.number(1, 6))),
        description: capitalizeText(sentences(R.number(1, 3))),
        audience: R.array_element(['student', 'teacher', 'pastor'])
      };
    };
    return makeContentPage = function() {
      return {
        id: idNum('contentPage'),
        type: 'ContentPage',
        title: titleCaseText(words(R.number(1, 6))),
        description: capitalizeText(sentences(R.number(1, 3))),
        audience: R.array_element(['student', 'teacher', 'pastor'])
      };
    };
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-wire/services/mocks.js.map