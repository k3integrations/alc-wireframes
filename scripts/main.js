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
  angular.module('ALC.Base').controller('registerCtrl', function($scope, $http, $state, $rootScope) {
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
        if (stateValue === 'avatar') {
          continue;
        }
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
      if (formIsValid()) {
        return $http.post('users', formData());
      }
    };
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-base/controllers/register.js.map
(function() {
  angular.module('ALC.Base').controller('searchCtrl', function($scope, $http, $rootScope, search) {
    var fetchNewResults;
    $scope.doSearch = function() {
      return fetchNewResults();
    };
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
    fetchNewResults = function() {
      return search.fetch($scope.query, $scope.filters).then(function(response) {
        return $scope.results = response.data;
      });
    };
    $scope.$watch('filters', fetchNewResults, true);
    $scope.$watch('query', fetchNewResults);
    $scope.defaultLimit = 3;
    return $http.get('schools', {
      params: {
        count: 10
      }
    }).then(function(response) {
      return $scope.schools = response.data;
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
        group: "=alcCheckboxGroup",
        "default": "@"
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
        if (scope["default"]) {
          scope.group[scope["default"]] = true;
          changeGroup(scope.group);
        }
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
  angular.module('ALC.Base').directive('alcShareResource', function(resourceCollection, $animate) {
    return {
      scope: {
        resourceId: '='
      },
      link: function(scope, element, attrs) {
        var empty, isIn, labels, notIn, updateDisplay;
        empty = element.find('[empty-collection]');
        notIn = element.find('[not-in-collection]');
        isIn = element.find('[in-collection]');
        labels = [empty, notIn, isIn];
        updateDisplay = function() {
          var label, _i, _len;
          for (_i = 0, _len = labels.length; _i < _len; _i++) {
            label = labels[_i];
            label.addClass('ng-hide');
          }
          if (resourceCollection.empty()) {
            return $animate.removeClass(empty, 'ng-hide');
          } else if (resourceCollection.contains(scope.resourceId)) {
            return $animate.removeClass(isIn, 'ng-hide');
          } else {
            return $animate.removeClass(notIn, 'ng-hide');
          }
        };
        resourceCollection.watch(scope, updateDisplay);
        updateDisplay();
        return element.on('click', function(e) {
          if (resourceCollection.empty() || !resourceCollection.contains(scope.resourceId)) {
            if (resourceCollection.empty()) {
              resourceCollection.open();
            }
            resourceCollection.add(scope.resourceId);
          } else {
            resourceCollection.remove(scope.resourceId);
          }
          return scope.$apply();
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-base/directives/shareResource.js.map
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
  angular.module('ALC.Base').factory('resourceCollection', function($modal) {
    var service;
    service = {
      collection: []
    };
    service.add = function(id) {
      if (!service.contains(id)) {
        return service.collection.push(id);
      }
    };
    service.remove = function(id) {
      return _.remove(service.collection, function(item) {
        return item === id;
      });
    };
    service.contains = function(id) {
      return _.contains(service.collection, id);
    };
    service.empty = function() {
      return service.collection.length === 0;
    };
    service.watch = function(scope, listener) {
      return scope.$watchCollection(function() {
        return service.collection;
      }, listener);
    };
    service.open = function() {
      var modal;
      return modal = $modal.open({
        templateUrl: 'partials/resource-collection-modal.html',
        controller: function($scope, collection, mockModels) {
          return $scope.resources = _.map(collection, function(id) {
            return mockModels.resources.get(id);
          });
        },
        resolve: {
          collection: function() {
            return service.collection;
          }
        },
        windowClass: 'medium'
      });
    };
    return service;
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-base/services/resourceCollection.js.map
(function() {
  angular.module('ALC.Base').provider('search', function() {
    var setUseRailsConvention, useRailsConvention;
    useRailsConvention = false;
    setUseRailsConvention = function(newValue) {
      return useRailsConvention = newValue;
    };
    return {
      setUseRailsConvention: setUseRailsConvention,
      $get: function($http) {
        return {
          setUseRailsConvention: setUseRailsConvention,
          buildFilterString: function(currentFilter, parentFilters) {
            var filter, filterPath, filterString, value;
            if (parentFilters == null) {
              parentFilters = "";
            }
            filterString = "";
            for (filter in currentFilter) {
              value = currentFilter[filter];
              filterPath = parentFilters;
              if (parentFilters !== "") {
                if (useRailsConvention) {
                  filterPath += "[" + filter + "]";
                } else {
                  filterPath += "." + filter;
                }
              } else {
                filterPath += filter;
              }
              filterString += angular.isObject(value) ? this.buildFilterString(value, filterPath) : "&" + filterPath + "=" + value;
            }
            return filterString;
          },
          fetch: function(search_term, filters) {
            var filterString;
            filterString = this.buildFilterString(filters);
            return $http.get("search_results?q=" + search_term + filterString);
          }
        };
      }
    };
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-base/services/search.js.map
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
  var app,
    __slice = [].slice;

  app = angular.module('ALC.Wire', ['ALC.Base', 'ui.router', 'ngMockE2E']);

  app.run(function($rootScope, resourceCollection) {
    $rootScope.flatten = function() {
      var objects;
      objects = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.merge.apply(_, [{}].concat(__slice.call(objects)));
    };
    $rootScope.JSONify = function(object) {
      return JSON.stringify(object);
    };
    return $rootScope.resourceCollection = resourceCollection;
  });

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
      templateUrl: 'partials/dashboard.html',
      controller: function($rootScope) {
        return $rootScope.wfUser || ($rootScope.wfUser = {
          name: {
            first: faker.Name.firstName(),
            last: faker.Name.lastName()
          }
        });
      }
    }).state('login', {
      params: ['login', 'password'],
      controller: function($stateParams, $state, $rootScope) {
        var login;
        login = $stateParams.login || '';
        $rootScope.wfUser = {
          login: login,
          name: {
            first: faker.Name.firstName(),
            last: faker.Name.lastName()
          },
          admin: login.match(/^admin@/) != null
        };
        return $state.go('dashboard');
      }
    }).state('logout', {
      controller: function($state, $rootScope) {
        $rootScope.wfUser = void 0;
        return $state.go('home');
      }
    }).state('search', {
      url: '/search/:category',
      templateUrl: 'partials/search-results.html',
      controller: function($scope, $stateParams, $rootScope) {
        var category;
        if (category = $stateParams.category) {
          $scope.wfDefaultCategory = category;
        }
        return $scope.$watch('query', function(query) {
          return $rootScope.wfSearchQuery = query;
        });
      }
    }).state('new resource', {
      url: '/resources/new',
      templateUrl: 'partials/resource-form.html',
      controller: function($scope) {
        var _ref;
        $scope.wfFormType = ((_ref = $scope.wfUser) != null ? _ref.admin : void 0) ? 'new.admin' : 'new';
        $scope.resource = {};
        return $scope.wfResource = {};
      }
    }).state('create resource', {
      params: ['resourceJSON'],
      controller: function($stateParams, $state, mockModels) {
        var params, resource;
        params = JSON.parse($stateParams.resourceJSON);
        params = _.pick(params, _.identity);
        resource = mockModels.resources.create(params);
        return $state.go('resource', {
          id: resource.id
        });
      }
    }).state('edit resource', {
      url: '/resources/:id/edit',
      templateUrl: 'partials/resource-form.html',
      controller: function($scope, $stateParams, mockModels) {
        $scope.wfFormType = 'edit';
        $scope.wfResource = mockModels.resources.get(+$stateParams.id);
        return $scope.resource = {
          resourceType: $scope.wfResource.resourceType
        };
      }
    }).state('update resource', {
      params: ['resourceJSON', 'id'],
      controller: function($stateParams, $state, mockModels) {
        var params, resource;
        params = JSON.parse($stateParams.resourceJSON);
        params = _.pick(params, _.identity);
        resource = mockModels.resources.update(+$stateParams.id, params);
        return $state.go('resource', {
          id: resource.id
        });
      }
    }).state('resource', {
      url: '/resources/:id',
      templateUrl: 'partials/resource.html',
      controller: function($scope, $stateParams, mockModels) {
        return $scope.wfResource = mockModels.resources.get(+$stateParams.id);
      }
    });
  });

}).call(this);

//# sourceMappingURL=../maps/alc-wire/main.js.map
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('ALC.Wire').factory('mockModels', function() {
    var A, AdventistOrganizationFactory, ChurchFactory, ConferenceFactory, ContentFactory, CourseFactory, D, I, L, MockModelFactory, R, ResourceFactory, SchoolFactory, UnionFactory, capitalizeStr, capitalizeText, defaultCount, mockModels, sentences, titleCaseText, words;
    A = faker.Address;
    D = faker.Date;
    I = faker.Internet;
    L = faker.Lorem;
    R = faker.random;
    sentences = function(count) {
      return L.sentences(count).split("\n").join('. ') + '.';
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
    MockModelFactory = (function() {
      function MockModelFactory(count) {
        this.count = count;
        this.lastId = 0;
        this.generateCollection();
      }

      MockModelFactory.prototype.generateCollection = function() {
        var i;
        return this.collection = (function() {
          var _i, _ref, _results;
          _results = [];
          for (i = _i = 1, _ref = this.count; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
            _results.push(this.generate());
          }
          return _results;
        }).call(this);
      };

      MockModelFactory.prototype.create = function(attrs) {
        var newObj;
        newObj = _.merge({}, this.generate(), attrs);
        this.collection.push(newObj);
        return newObj;
      };

      MockModelFactory.prototype.update = function(id, attrs) {
        var obj;
        obj = this.get(id);
        _.merge(obj, attrs);
        return obj;
      };

      MockModelFactory.prototype.get = function(id) {
        return _.find(this.collection, function(obj) {
          return obj.id === id;
        });
      };

      MockModelFactory.prototype.all = function(count, offset) {
        var end, start;
        if (offset == null) {
          offset = 0;
        }
        start = offset;
        end = count != null ? offset + count : this.collection.length;
        return this.collection.slice(start, end);
      };

      MockModelFactory.prototype.generateId = function() {
        return ++this.lastId;
      };

      MockModelFactory.prototype.generate = function() {
        return {
          id: this.generateId()
        };
      };

      return MockModelFactory;

    })();
    AdventistOrganizationFactory = (function(_super) {
      __extends(AdventistOrganizationFactory, _super);

      function AdventistOrganizationFactory() {
        return AdventistOrganizationFactory.__super__.constructor.apply(this, arguments);
      }

      AdventistOrganizationFactory._ids_ = [null];

      AdventistOrganizationFactory.prototype.generateId = function() {
        var chars, i, id, letters, numbers;
        letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        numbers = '0123456789';
        chars = (letters + numbers).split('');
        while (!((id != null) && !~this.constructor._ids_.indexOf(id))) {
          id = 'AN' + ((function() {
            var _i, _results;
            _results = [];
            for (i = _i = 1; _i <= 4; i = ++_i) {
              _results.push(R.array_element(chars));
            }
            return _results;
          })()).join('');
        }
        this.constructor._ids_.push(id);
        return id;
      };

      AdventistOrganizationFactory.prototype.generateName = function() {
        throw "Not Implemented";
      };

      AdventistOrganizationFactory.prototype.generate = function() {
        return {
          id: this.generateId(),
          name: this.generateName()
        };
      };

      return AdventistOrganizationFactory;

    })(MockModelFactory);
    SchoolFactory = (function(_super) {
      __extends(SchoolFactory, _super);

      function SchoolFactory() {
        return SchoolFactory.__super__.constructor.apply(this, arguments);
      }

      SchoolFactory.prototype.generateName = function() {
        var city, middle, suffix;
        city = A.city();
        middle = R.array_element(['', 'Adventist']);
        suffix = R.array_element(['University', 'College', 'Adventist University']);
        return ("" + city + " " + middle + " " + suffix).replace(/\s+/g, ' ');
      };

      return SchoolFactory;

    })(AdventistOrganizationFactory);
    ChurchFactory = (function(_super) {
      __extends(ChurchFactory, _super);

      function ChurchFactory() {
        return ChurchFactory.__super__.constructor.apply(this, arguments);
      }

      ChurchFactory.prototype.generateName = function() {
        var city, middle;
        city = A.city();
        middle = R.array_element(['SDA', 'Adventist', 'Seventh-day Adventist']);
        return "" + city + " " + middle + " Church";
      };

      return ChurchFactory;

    })(AdventistOrganizationFactory);
    UnionFactory = (function(_super) {
      __extends(UnionFactory, _super);

      function UnionFactory() {
        return UnionFactory.__super__.constructor.apply(this, arguments);
      }

      UnionFactory.prototype.generateName = function() {
        return "" + (A.usState()) + " Union";
      };

      return UnionFactory;

    })(AdventistOrganizationFactory);
    ConferenceFactory = (function(_super) {
      __extends(ConferenceFactory, _super);

      function ConferenceFactory() {
        return ConferenceFactory.__super__.constructor.apply(this, arguments);
      }

      ConferenceFactory.prototype.generateName = function() {
        return "" + (A.usState()) + " Conference";
      };

      return ConferenceFactory;

    })(AdventistOrganizationFactory);
    CourseFactory = (function(_super) {
      __extends(CourseFactory, _super);

      function CourseFactory(count, schools) {
        this.schools = schools;
        CourseFactory.__super__.constructor.call(this, count);
      }

      CourseFactory.prototype.generate = function() {
        return {
          id: this.generateId(),
          type: 'Course',
          title: titleCaseText(words(R.number(1, 6))),
          description: capitalizeText(sentences(R.number(1, 3))),
          audience: R.array_element(['student', 'teacher', 'pastor']),
          coreCompetency: R.array_element(['one', 'two', 'three', 'four', 'five']),
          offeredBy: R.array_element(this.schools.all())
        };
      };

      return CourseFactory;

    })(MockModelFactory);
    ResourceFactory = (function(_super) {
      __extends(ResourceFactory, _super);

      function ResourceFactory(count, schools) {
        this.schools = schools;
        ResourceFactory.__super__.constructor.call(this, count);
      }

      ResourceFactory.prototype.generate = function() {
        var object;
        object = {
          id: this.generateId(),
          type: 'Resource',
          resourceType: R.array_element(['PDF', 'Video', 'PowerPoint', 'Link']),
          title: titleCaseText(words(R.number(1, 6))),
          description: capitalizeText(sentences(R.number(1, 5))),
          audience: R.array_element(['student', 'teacher', 'pastor']),
          source: R.array_element(this.schools.all()),
          publishedAt: D.recent(365)
        };
        if (~['PDF', 'PowerPoint'].indexOf(object.resourceType)) {
          object.file = "/uploads/" + object.resourceType + "/" + (R.number(1000));
        } else {
          object.url = "http://" + (I.domainName()) + "/file/" + (R.number(1000));
        }
        return object;
      };

      return ResourceFactory;

    })(MockModelFactory);
    ContentFactory = (function(_super) {
      __extends(ContentFactory, _super);

      function ContentFactory() {
        return ContentFactory.__super__.constructor.apply(this, arguments);
      }

      ContentFactory.prototype.generate = function() {
        return {
          id: this.generateId(),
          type: 'ContentPage',
          title: titleCaseText(words(R.number(1, 6))),
          description: capitalizeText(sentences(R.number(1, 3))),
          audience: R.array_element(['student', 'teacher', 'pastor'])
        };
      };

      return ContentFactory;

    })(MockModelFactory);
    defaultCount = 100;
    mockModels = {
      schools: new SchoolFactory(defaultCount),
      churches: new ChurchFactory(defaultCount),
      unions: new UnionFactory(5),
      conferences: new ConferenceFactory(12),
      contentPages: new ContentFactory(defaultCount)
    };
    mockModels.courses = new CourseFactory(defaultCount, mockModels.schools);
    mockModels.resources = new ResourceFactory(defaultCount, mockModels.schools);
    return mockModels;
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-wire/services/mock-models.js.map
(function() {
  angular.module('ALC.Wire').run(function($httpBackend, $state, $rootScope, mockModels) {
    var params;
    $httpBackend.whenGET(/^partials\//).passThrough();
    $httpBackend.whenGET(/^schools/).respond(function(method, url, data) {
      var schools;
      schools = mockModels.schools.all(params(url).count || 100);
      return [200, schools, {}];
    });
    $httpBackend.whenGET(/^churches/).respond(function(method, url, data) {
      var churches;
      churches = mockModels.churches.all(params(url).count || 100);
      return [200, churches, {}];
    });
    $httpBackend.whenGET(/^unions_and_conferences/).respond(function(method, url, data) {
      var conferences, count, unions;
      count = params(url).count || 50;
      unions = mockModels.unions.all(count);
      conferences = mockModels.conferences.all(count);
      return [200, _.flatten([unions, conferences]), {}];
    });
    $httpBackend.whenGET(/^search_results/).respond(function(method, url, data) {
      var count, courses, pages, resources;
      count = params(url).count || 50;
      courses = mockModels.courses.all(count);
      resources = mockModels.resources.all(count);
      pages = mockModels.contentPages.all(count);
      return [200, _.flatten([courses, resources, pages]), {}];
    });
    $httpBackend.whenPOST(/^users/).respond(function(method, url, data) {
      $rootScope.wfUser = JSON.parse(data);
      $state.go('dashboard');
      return [302, '', {}];
    });
    return params = function(url) {
      return $.parseParams(url);
    };
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-wire/services/mocks.js.map