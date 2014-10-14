(function() {
  var app, themes;

  themes = {
    wf: {
      background: '#888',
      foreground: '#aaa',
      size: '11',
      font: 'Helvetica Neue, Helvetica, sans-serif',
      fontweight: 'lighter'
    }
  };

  themes['wf-dark'] = _.merge({}, themes.wf, {
    background: '#555',
    foreground: '#777'
  });

  themes['wf-blank'] = _.merge({}, themes.wf, {
    foreground: themes.wf.background
  });

  Holder.add_theme('wf', themes.wf).add_theme('wf-dark', themes['wf-dark']).add_theme('wf-blank', themes['wf-blank']).run();

  app = angular.module('ALC.Base', ['mm.foundation', 'ngDropzone', 'ui.utils', 'ngAnimate', 'ui.select', 'ngTagsInput', 'toastr']);

  app.config(function(uiSelectConfig, toastrConfig, $httpProvider) {
    uiSelectConfig.theme = 'select2';
    angular.extend(toastrConfig, {
      positionClass: 'toast-top-right'
    });
    $httpProvider.defaults.headers.common['X-Requested-With'] = "XMLHttpRequest";
    return $httpProvider.defaults.headers.common.Accept = "application/json";
  });

}).call(this);

//# sourceMappingURL=../maps/alc-base/main.js.map
(function() {
  angular.module('ALC.Base').controller('registerCtrl', function($scope, $http, $state, $rootScope, NADToolkit) {
    'use strict';
    var formData, formIsValid, isCurrentlyValid;
    $scope.roleStates = {
      'student': ['role', 'studentId', 'name', 'dob', 'email', 'password', 'avatar', 'confirm'],
      'teacher': ['role', 'teacherRole', 'name', 'dob', 'email', 'password', 'avatar', 'confirm'],
      'schoolTeacher': ['role', 'teacherRole', 'schoolId', 'name', 'dob', 'email', 'password', 'avatar', 'confirm'],
      'toolkitTeacher': ['role', 'teacherRole', 'edToolkitLogin', 'dob', 'password', 'avatar', 'confirm'],
      'pastor': ['role', 'churchIds', 'name', 'email', 'password', 'avatar', 'confirm'],
      'org leader': ['role', 'adminRole', 'orgId', 'name', 'dob', 'email', 'password', 'avatar', 'confirm'],
      'edu org leader': ['role', 'adminRole', 'edToolkitLogin', 'password', 'avatar', 'confirm'],
      'min org leader': ['role', 'adminRole', 'orgId', 'name', 'dob', 'email', 'password', 'avatar', 'confirm'],
      'person': ['role', 'churchId', 'name', 'email', 'password', 'avatar', 'confirm']
    };
    $scope.edToolkitImport = function() {
      $scope.loggingIn = true;
      return NADToolkit["import"]().then(function(data) {
        $scope.registrant.edToolkitImported = true;
        return $scope.regForm.$valid = true;
      }, function(data) {
        return alert(data);
      });
    };
    $scope.edToolkitInit = function() {
      if (!$scope.registrant.edToolkitImported) {
        return $scope.regForm.$valid = false;
      }
    };
    $scope.swapCurrentState = function(newState) {
      var idx;
      idx = $scope.currentStateIndex();
      return $scope.currentState = $scope.states[idx] = newState;
    };
    $scope.form = {};
    if ($scope.registrant == null) {
      $scope.registrant = {};
    }
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
    $scope.dzInit = function(a, b, c, d, e) {
      return $scope.dropzone = this;
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
        if ($scope.validStates[stateValue] !== true) {
          return false;
        }
      }
      return true;
    };
    formData = function() {
      var church, data, objectsToId, param, stateValue, value, _i, _j, _len, _len1, _ref;
      data = {};
      _ref = $scope.states;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stateValue = _ref[_i];
        if (stateValue === 'avatar') {
          continue;
        }
        value = $scope.registrant[stateValue];
        if (value) {
          data[_.str.underscored(stateValue)] = value;
        }
      }
      delete data['avatar'];
      if (data.name) {
        data["first_name"] = data.name.first;
        data["last_name"] = data.name.last;
        delete data['name'];
      }
      if (data.dob) {
        data['date_of_birth'] = data.dob;
        delete data['dob'];
      }
      if (data.church_ids) {
        data.church_ids = ((function() {
          var _j, _len1, _ref1, _results;
          _ref1 = data.church_ids;
          _results = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            church = _ref1[_j];
            _results.push(church.id);
          }
          return _results;
        })()).join(',');
      }
      objectsToId = ['org_id', 'school_id', 'church_id'];
      for (_j = 0, _len1 = objectsToId.length; _j < _len1; _j++) {
        param = objectsToId[_j];
        if (data[param]) {
          data[param] = data[param].id;
        }
      }
      return data;
    };
    $scope.dzSuccess = function() {
      return $state.go("dashboard");
    };
    $scope.dzError = function(file, response, xhr) {
      var key, value, _results;
      file.status = Dropzone.QUEUED;
      if ((typeof response) === "string") {
        return alert("Something went wrong");
      } else {
        _results = [];
        for (key in response) {
          value = response[key];
          _results.push(alert(key + " " + value));
        }
        return _results;
      }
    };
    $scope.dzSending = function(file, xhr, fd) {
      var form_data, key, value, _results;
      form_data = formData();
      _results = [];
      for (key in form_data) {
        value = form_data[key];
        _results.push(fd.append("user[" + key + "]", value));
      }
      return _results;
    };
    return $scope.submitForm = function(event) {
      $scope.setValidity();
      if (event) {
        event.preventDefault();
      }
      if (formIsValid()) {
        return $scope.dropzone.processQueue();
      }
    };
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-base/controllers/register.js.map
(function() {
  'use strict';

  /**
    * @ngdoc function
    * @name ALC.Base.controller:resourceCtrl
    * @description
    * # resourceCtrl
    * Controller of the ALC.Base
   */
  angular.module('ALC.Base').controller('resourceCtrl', function($scope, $modal, toastr, ceuManager) {
    return $scope.takeCEU = function() {
      this.ceuModal = $modal.open({
        templateUrl: 'partials/take-ceu-form.html',
        windowClass: 'small'
      });
      return this.ceuModal.result.then(function(result) {
        return ceuManager.requestWithAnswers(result).then(function() {
          toastr.success("Successfully submitted your CEU answers!");
          return $scope.ceuCreditGiven = true;
        }, function() {
          return toastr.error("Could not submit your CEU answers. Please try again.");
        });
      });
    };
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-base/controllers/resource.js.map
(function() {
  angular.module('ALC.Base').controller('searchCtrl', function($scope, $http, $rootScope, search) {
    var fetchNewResults;
    $scope.schools = [];
    $scope.filters = {
      categories: {
        all: true
      },
      audiences: {
        all: true
      },
      file_types: {
        all: true
      },
      core_competencies: {
        all: true
      }
    };
    fetchNewResults = function() {
      var filters;
      filters = angular.copy($scope.filters);
      return search.fetch($scope.query, filters).then(function(response) {
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
  'use strict';

  /**
    * @ngdoc directive
    * @name ALC.Base.directive:alcCreditBadge
    * @description
    * # alcCreditBadge
   */
  angular.module('ALC.Base').directive('alcCreditBadge', function() {
    return {
      template: "<span class=\"credit-amount\"\n  ng-pluralize count=\"creditAmount\"\n  when=\"{'0': 'No Credit', 1:'1 cr', 'other': '{} crs'}\"\n></span>",
      restrict: 'A',
      scope: {
        creditAmount: '=alcCreditBadge'
      },
      link: function(scope, element, attrs) {}
    };
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-base/directives/creditBadge.js.map
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
  'use strict';

  /**
    * @ngdoc directive
    * @name ALC.Base.directive:alcServerForm
    * @description
    * # alcServerForm
   */
  angular.module('ALC.Base').directive('alcServerForm', function() {
    return {
      restrict: 'A',
      require: 'form',
      priority: -1,
      link: function(scope, element, attrs, formController) {
        return element.on('submit', function(e) {
          var input, propName;
          if (formController.$invalid) {
            e.preventDefault();
            for (propName in formController) {
              input = formController[propName];
              if (input.$setViewValue != null) {
                input.$setViewValue(input.$viewValue);
              }
            }
            e.stopImmediatePropagation();
          }
          return scope.$apply();
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-base/directives/serverForm.js.map
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
  'use strict';
  angular.module('ALC.Base').filter('pluralize', function() {
    return function(singular, count, plural) {
      if (plural == null) {
        plural = "" + singular + "s";
      }
      if (count === 1) {
        return singular;
      } else {
        return plural;
      }
    };
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-base/filters/pluralize.js.map
(function() {
  'use strict';
  angular.module('ALC.Base').filter('truncate', function() {
    return function(text, length, omission) {
      if (length == null) {
        length = 30;
      }
      if (omission == null) {
        omission = '…';
      }
      if (text.length <= length) {
        return text;
      }
      return text.slice(0, length - omission.length) + omission;
    };
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-base/filters/truncate.js.map
(function() {
  angular.module("ALC.Base").factory("NADToolkit", function($q) {
    var NADToolkit;
    return NADToolkit = (function() {
      function NADToolkit() {}

      NADToolkit["import"] = function() {
        return $q.when({});
      };

      return NADToolkit;

    })();
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-base/services/NADToolkit.js.map
(function() {
  'use strict';

  /**
    * @ngdoc service
    * @name ALC.Base.ceuManager
    * @description
    * # ceuManager
    * Provider in the ALC.Base.
   */
  angular.module('ALC.Base').provider('ceuManager', function() {
    var CeuManager, path;
    path = '/resource/ceu_request';
    CeuManager = (function() {
      function CeuManager($http) {
        this.http = $http;
      }

      CeuManager.prototype.setPath = function(_path) {
        return path = _path;
      };

      CeuManager.prototype.requestWithAnswers = function(answers) {
        return this.http.post(path, answers);
      };

      return CeuManager;

    })();
    this.setPath = CeuManager.setPath;
    this.$get = [
      '$http', function($http) {
        return new CeuManager($http);
      }
    ];
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-base/services/ceuManager.js.map
(function() {
  angular.module('ALC.Base').factory('resourceCollection', function($modal, toastr) {
    var service;
    service = {
      collection: [],
      modal: {}
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
    service.reset = function() {
      service.collection = [];
      return service.modal = {};
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
      service.modal = $modal.open({
        templateUrl: 'partials/resource-collection-modal.html',
        windowClass: 'medium'
      });
      return service.modal.result.then(function(msg) {
        return toastr.info(msg);
      });
    };
    return service;
  });

  angular.module('ALC.Base').controller('resourceCollectionCtrl', function($scope, resourceCollection, mockModels) {
    $scope.resources = _.map(resourceCollection.collection, function(id) {
      return mockModels.resources.get(id);
    });
    $scope.count = $scope.resources.length;
    $scope.showCollection = $scope.count === 1;
    return $scope.sendIt = function(msg) {
      if ($scope.resourceCollectionForm.$valid) {
        resourceCollection.modal.close(msg);
        return resourceCollection.reset();
      } else {
        $scope.resourceCollectionForm.recipients.$dirty = true;
        return $scope.resourceCollectionForm.message.$dirty = true;
      }
    };
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
  var app, createUser;

  app = angular.module('ALC.Wire', ['ALC.Base', 'ui.router', 'ngMockE2E', 'ALC.Wire.Submit']);

  createUser = function(scope, attrs) {
    var admin, login;
    if (attrs == null) {
      attrs = {};
    }
    login = attrs.login || '';
    admin = login.match(/^admin@/) != null;
    return scope.wfUser != null ? scope.wfUser : scope.wfUser = _.merge({}, {
      name: {
        first: faker.name.firstName(),
        last: faker.name.lastName()
      },
      admin: admin
    }, attrs);
  };

  app.run(function($rootScope, $state, resourceCollection, $log) {
    $rootScope._merge = _.merge;
    $rootScope.resourceCollection = resourceCollection;
    $rootScope.$on('$stateChangeSuccess', function(e, to, toParams) {
      if (toParams.autoLogin === 'true') {
        createUser($rootScope);
      }
    });
    $rootScope.$on('$stateChangeSuccess', function(e, t, tp, from, fromParams) {
      $state.previous = from;
      $state.previousParams = fromParams;
    });
    $state.havePrevious = function() {
      var _ref;
      return ((_ref = $state.previous) != null ? _ref.name : void 0) !== '';
    };
    return $state.goBack = function() {
      if ($state.havePrevious()) {
        return $state.go($state.previous.name, $state.previousParams);
      } else {
        return $log.error('Can’t go back to non-existent previous state.');
      }
    };
  });

  app.config(function($stateProvider, $urlRouterProvider) {
    'use strict';
    var addCourseToMyCourses, dashboardOrPay;
    $stateProvider.decorator('url', function(state, urlMatcher) {
      var original, _ref;
      original = urlMatcher(state);
      if ((original != null ? (_ref = original.sourceSearch) != null ? _ref.match : void 0 : void 0) != null) {
        if (!original.sourceSearch.match(/\?autoLogin\b/)) {
          return original.concat('?autoLogin');
        }
      }
      return original;
    });
    addCourseToMyCourses = function(rootScope, mockModels, id) {
      if (rootScope.wfMyCourses == null) {
        rootScope.wfMyCourses = [];
      }
      return rootScope.wfMyCourses.push(mockModels.courses.get(+id));
    };
    $urlRouterProvider.otherwise('/');
    dashboardOrPay = function($rootScope, $state, course) {
      if (course.cost > 0) {
        $rootScope.wfCourseRegistering = course;
        return $state.go('course_pay');
      } else {
        return $state.go('dashboard');
      }
    };
    return $stateProvider.state('home', {
      url: '/',
      templateUrl: 'partials/home.html'
    }).state('register', {
      url: '/register?courseId',
      templateUrl: 'partials/register.html',
      controller: function($scope, $rootScope, $state, mockModels) {
        $scope.registrant = {};
        if ($state.params.courseId != null) {
          $scope.wfCourse = mockModels.courses.get(+$state.params.courseId);
        }
        return Dropzone.prototype.processQueue = function() {
          createUser($rootScope, {
            login: $scope.registrant.email
          });
          if ($state.params.courseId != null) {
            addCourseToMyCourses($rootScope, mockModels, $state.params.courseId);
          }
          return dashboardOrPay($rootScope, $state, $scope.wfCourse);
        };
      }
    }).state('_dashboard', {
      url: '/dashboard?empty',
      abstract: true,
      templateUrl: 'partials/dashboard.html',
      controller: function($rootScope, $scope, $state) {
        $scope.wfEmptyDashboard = $state.params.empty === 'true';
        if (!$rootScope.wfUser) {
          if ($state.havePrevious()) {
            return $state.goBack();
          } else {
            return $state.go('home');
          }
        }
      }
    }).state('dashboard', {
      url: '',
      parent: '_dashboard',
      templateUrl: 'partials/dashboard.full.html',
      controller: function($scope, $state, mockModels) {
        if ($state.params.empty === 'true') {
          $scope.wfCoursesTeaching = [];
          $scope.wfCoursesEnrolled = [];
          $scope.wfCoursesComplete = [];
          return $scope.wfECertifications = [];
        } else {
          $scope.wfCoursesTeaching = mockModels.courses.all(3);
          $scope.wfCoursesEnrolled = mockModels.courses.all(5, 25);
          $scope.wfCoursesComplete = mockModels.courses.all(2, 50);
          $scope.wfCredits = mockModels.credits.all(5);
          return $scope.wfECertifications = [
            {
              title: faker.lorem.words(3).join(' ')
            }, {
              title: faker.lorem.words(3).join(' ')
            }
          ];
        }
      }
    }).state('dashboard.taught', {
      url: '/taught',
      parent: '_dashboard',
      templateUrl: 'partials/dashboard.taught.html',
      controller: function($scope, mockModels) {
        return $scope.wfCoursesTaught = mockModels.courses.all(7, 15);
      }
    }).state('dashboard.taken', {
      url: '/taken',
      parent: '_dashboard',
      templateUrl: 'partials/dashboard.taken.html',
      controller: function($scope, mockModels) {
        return $scope.wfCoursesTaken = mockModels.courses.all(2, 35);
      }
    }).state('dashboard.completed', {
      url: '/completed',
      parent: '_dashboard',
      templateUrl: 'partials/dashboard.completed.html',
      controller: function($scope, mockModels) {
        return $scope.wfCoursesCompleted = mockModels.courses.all(22, 60);
      }
    }).state('dashboard.eportfolio', {
      url: '/ePortfolio',
      parent: '_dashboard',
      templateUrl: 'partials/dashboard.ePortfolio.html',
      controller: function($scope, mockModels) {
        $scope.wfCredits = mockModels.credits.all(5, 4);
        return $scope.wfECertifications = [
          {
            title: faker.lorem.words(3).join(' ')
          }, {
            title: faker.lorem.words(3).join(' ')
          }, {
            title: faker.lorem.words(3).join(' ')
          }, {
            title: faker.lorem.words(3).join(' ')
          }, {
            title: faker.lorem.words(3).join(' ')
          }, {
            title: faker.lorem.words(3).join(' ')
          }, {
            title: faker.lorem.words(3).join(' ')
          }, {
            title: faker.lorem.words(3).join(' ')
          }, {
            title: faker.lorem.words(3).join(' ')
          }, {
            title: faker.lorem.words(3).join(' ')
          }
        ];
      }
    }).state('login', {
      params: {
        'login': {},
        'returnTo': {}
      },
      controller: function($stateParams, $state, $rootScope) {
        var login;
        login = $stateParams.login || {};
        createUser($rootScope, {
          login: login.email
        });
        if ($state.havePrevious()) {
          return $state.goBack();
        } else {
          return $state.go('dashboard');
        }
      }
    }).state('logout', {
      url: '/logout',
      controller: function($state, $rootScope) {
        $rootScope.wfUser = void 0;
        if ($state.havePrevious()) {
          return $state.goBack();
        } else {
          return $state.go('home');
        }
      }
    }).state('profile', {
      url: '/profile',
      parent: '_dashboard',
      templateUrl: 'partials/profile.html',
      controller: function($scope, $rootScope, mockModels) {
        var user;
        user = mockModels.users.generate();
        $scope.wfUser = _.merge({}, user, $rootScope.wfUser);
        return $rootScope.wfUser = $scope.wfUser;
      }
    }).state('profile.edit', {
      url: '/profile/edit',
      parent: '_dashboard',
      templateUrl: 'partials/edit-profile.html',
      controller: function($scope, $rootScope, mockModels) {
        var user;
        user = mockModels.users.generate();
        $scope.wfUser = _.merge({}, user, $rootScope.wfUser);
        return $rootScope.wfUser = $scope.wfUser;
      }
    }).state('profile.changePassword', {
      url: '/profile/change-password',
      parent: '_dashboard',
      templateUrl: 'partials/change-password.html',
      controller: function($scope, $rootScope, mockModels) {
        var user;
        user = mockModels.users.generate();
        $scope.wfUser = _.merge({}, user, $rootScope.wfUser);
        return $rootScope.wfUser = $scope.wfUser;
      }
    }).state('search', {
      url: '/search/:category',
      params: {
        'category': void 0,
        'query': void 0
      },
      templateUrl: 'partials/search-results.html',
      controller: function($scope, $stateParams, $rootScope) {
        var category, query;
        if (category = $stateParams.category) {
          $scope.wfDefaultCategory = category;
        }
        if (query = $stateParams.query) {
          return $rootScope.wfSearchQuery = query;
        }
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
      params: {
        'resource': {}
      },
      controller: function($stateParams, $state, mockModels) {
        var params, resource;
        params = _.pick($stateParams.resource, _.identity);
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
      params: {
        'resource': {},
        'id': ''
      },
      controller: function($stateParams, $state, mockModels) {
        var params, resource;
        params = _.pick($stateParams.resource, _.identity);
        resource = mockModels.resources.update(+$stateParams.id, params);
        return $state.go('resource', {
          id: resource.id
        });
      }
    }).state('resource', {
      url: '/resources/:id',
      templateUrl: 'partials/resource.html',
      controller: function($scope, $stateParams, mockModels, $rootScope, ceuManager) {
        $scope.wfResource = mockModels.resources.get(+$stateParams.id);
        if ($rootScope.wfResourcesWithCreditGiven == null) {
          $rootScope.wfResourcesWithCreditGiven = [];
        }
        if (~$rootScope.wfResourcesWithCreditGiven.indexOf($scope.wfResource)) {
          $scope.wfCreditGiven = true;
        }
        ceuManager._requestWithAnswers = ceuManager.requestWithAnswers;
        return ceuManager.requestWithAnswers = function(answers) {
          return this._requestWithAnswers(answers).then(function() {
            $rootScope.wfResourcesWithCreditGiven.push($scope.wfResource);
          });
        };
      }
    }).state('course', {
      url: '/courses/:id',
      templateUrl: 'partials/course.html',
      controller: function($scope, $stateParams, mockModels) {
        return $scope.wfCourse = mockModels.courses.get(+$stateParams.id);
      }
    }).state('course_sign_up', {
      params: {
        id: null
      },
      controller: function($state, mockModels, $rootScope, $stateParams) {
        var course, id;
        if ($rootScope.wfUser) {
          id = +$stateParams.id;
          course = mockModels.courses.get(id);
          addCourseToMyCourses($rootScope, mockModels, id);
          return dashboardOrPay($rootScope, $state, course);
        } else {
          return $state.go('register', {
            courseId: $stateParams.id
          });
        }
      }
    }).state('course_pay', {
      url: '/register/pay',
      templateUrl: 'partials/course-pay.html'
    }).state('course_paid', {
      controller: function($state) {
        return $state.go('dashboard');
      }
    }).state('get_ceu_credit', {
      url: '/get_ceu_credit',
      templateUrl: 'partials/get-ceu-credit.html',
      controller: function($state) {}
    }).state('submit_ceu_credit', {
      params: {
        answers: {}
      },
      templateUrl: 'partials/get-ceu-credit.html',
      controller: function($state, $rootScope) {
        $state.go('dashboard');
        return $rootScope.wfFlash = "Successfully submitted event for CEU credit!";
      }
    }).state('promo_page', {
      abstract: true,
      templateUrl: 'partials/promo-page.html'
    }).state('promo_page.student', {
      url: '/students',
      templateUrl: 'partials/promo-page.student.html',
      controller: function($scope) {
        return $scope.role = 'Student';
      }
    }).state('promo_page.teacher', {
      url: '/teachers',
      templateUrl: 'partials/promo-page.teacher.html',
      controller: function($scope) {
        return $scope.role = 'Student';
      }
    }).state('promo_page.pastor', {
      url: '/pastors',
      templateUrl: 'partials/promo-page.pastor.html',
      controller: function($scope) {
        return $scope.role = 'Student';
      }
    }).state('promo_page.leader', {
      url: '/leaders',
      templateUrl: 'partials/promo-page.leader.html',
      controller: function($scope) {
        return $scope.role = 'Student';
      }
    }).state('promo_page.believer', {
      url: '/believers',
      templateUrl: 'partials/promo-page.believer.html',
      controller: function($scope) {
        return $scope.role = 'Student';
      }
    });
  });

}).call(this);

//# sourceMappingURL=../maps/alc-wire/main.js.map
(function() {
  'use strict';
  var app;

  app = angular.module('ALC.Wire.Submit', ['ui.router']);


  /**
    * @ngdoc directive
    * @name ALC.Wire.directive:alcSubmit
    * @description
    * # alcSubmit
   */

  angular.module('ALC.Wire.Submit').directive('wfSubmit', function($state) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        return element.on('submit', function(e) {
          e.preventDefault();
          $state.go(attrs.action, scope.$eval(attrs.wfSubmit));
          return scope.$apply();
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-wire/directives/submit.js.map
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('ALC.Wire').factory('mockModels', function() {
    var A, AdventistOrganizationFactory, C, ChurchFactory, ConferenceFactory, ContentPageFactory, CourseFactory, CreditFactory, D, F, H, Ha, I, IMG, L, MockModelFactory, N, P, R, ResourceFactory, SchoolFactory, UnionFactory, UserFactory, capitalizeStr, capitalizeText, defaultCount, mockModels, paragraph, paragraphs, sentences, titleCaseText, words;
    A = faker.address;
    C = faker.company;
    D = faker.date;
    F = faker.finance;
    Ha = faker.hacker;
    H = faker.helpers;
    IMG = faker.image;
    I = faker.internet;
    L = faker.lorem;
    N = faker.name;
    P = faker.phone;
    R = faker.random;
    words = function(count) {
      return L.words(count).join(' ');
    };
    sentences = function(count) {
      return _.map(L.sentences(count).split("\n"), function(str) {
        return _.str.capitalize(str);
      }).join('. ') + '.';
    };
    paragraph = function() {
      return sentences(R.number(4) + 1);
    };
    paragraphs = function(count) {
      var i;
      return ((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; 1 <= count ? _i <= count : _i >= count; i = 1 <= count ? ++_i : --_i) {
          _results.push(paragraph());
        }
        return _results;
      })()).join("\n");
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
      function MockModelFactory(count, models) {
        this.count = count;
        this.models = models;
        this.lastId = 0;
        Object.defineProperty(this, 'collection', {
          get: function() {
            var i;
            this._collection || (this._collection = (function() {
              var _i, _ref, _results;
              _results = [];
              for (i = _i = 1, _ref = this.count; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
                _results.push(this.generate());
              }
              return _results;
            }).call(this));
            return this._collection;
          }
        });
      }

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
    UserFactory = (function(_super) {
      __extends(UserFactory, _super);

      function UserFactory() {
        return UserFactory.__super__.constructor.apply(this, arguments);
      }

      UserFactory.prototype.generateDateOfBirth = function() {
        return D.between(moment().subtract(50, 'years'), moment().subtract(18, 'years'));
      };

      UserFactory.prototype.generateChurchId = function() {
        return H.randomize(_.pluck(this.models.churches.all(), 'id'));
      };

      UserFactory.prototype.generateSchoolId = function() {
        return H.randomize(_.pluck(this.models.schools.all(), 'id'));
      };

      UserFactory.prototype.generateStudentId = function() {
        var i, numbers;
        numbers = '0123456789';
        return '' + ((function() {
          var _i, _results;
          _results = [];
          for (i = _i = 1; _i <= 9; i = ++_i) {
            _results.push(H.randomize(numbers));
          }
          return _results;
        })()).join('');
      };

      UserFactory.prototype.generateStudentDateOfBirth = function() {
        return D.between(moment().subtract(26, 'years'), moment().subtract(17, 'years'));
      };

      UserFactory.prototype.generateTeacherDateOfBirth = function() {
        return D.between(moment().subtract(55, 'years'), moment().subtract(28, 'years'));
      };

      UserFactory.prototype.generate = function(role) {
        var object;
        object = {
          id: this.generateId(),
          role: role || H.randomize(['Student', 'Teacher', 'Pastor', 'Org. Leader', 'Person']),
          name: {
            first: N.firstName(),
            last: N.lastName()
          },
          dob: this.generateDateOfBirth(),
          email: I.email(),
          password: I.password(),
          avatar: I.avatar(),
          churchId: this.generateChurchId()
        };
        if (object.role === 'Student') {
          object.studentId = H.randomize([null, this.generateStudentId()]);
          if (!object.studentId) {
            object.schoolId = this.generateSchoolId();
          }
          object.dob = this.generateStudentDateOfBirth();
        }
        if (object.role === 'Teacher') {
          object.teacherRole = H.randomize(['?']);
          object.schoolId = this.generateSchoolId();
          object.dob = this.generateTeacherDateOfBirth();
        }
        if (object.role === 'Pastor') {
          object.churchIds = [this.generateChurchId()];
        }
        if (object.schoolId != null) {
          object.school = this.models.schools.get(object.schoolId);
        }
        if (object.churchId != null) {
          object.church = this.models.churches.get(object.churchId);
        }
        return object;
      };

      return UserFactory;

    })(MockModelFactory);
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
              _results.push(H.randomize(chars));
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
        middle = H.randomize(['', 'Adventist']);
        suffix = H.randomize(['University', 'College', 'School', 'Elementary', 'Academy']);
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
        middle = H.randomize(['SDA', 'Adventist', 'Seventh-day Adventist']);
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

      function CourseFactory() {
        return CourseFactory.__super__.constructor.apply(this, arguments);
      }

      CourseFactory.prototype.generateTeacher = function() {
        return {
          name: {
            first: N.firstName(),
            last: N.lastName()
          },
          bio: paragraphs(R.number(1, 2))
        };
      };

      CourseFactory.prototype.generateBeginDate = function() {
        return D.between(moment().add(3, 'days'), moment().add(30, 'days'));
      };

      CourseFactory.prototype.generateEndDate = function() {
        return D.between(moment().add(40, 'days'), moment().add(90, 'days'));
      };

      CourseFactory.prototype.generate = function() {
        var seats;
        return {
          id: this.generateId(),
          "class": 'Course',
          title: titleCaseText(words(H.randomNumber({
            min: 1,
            max: 6
          }))),
          description: paragraphs(R.number(1, 3)),
          prerequisites: paragraphs(R.number(1, 4)),
          outcome: paragraphs(R.number(1, 4)),
          audience: H.randomize(['student', 'teacher', 'pastor']),
          coreCompetency: H.randomize(['one', 'two', 'three', 'four', 'five']),
          offeredBy: H.randomize(this.models.schools.all()),
          cost: H.randomize([
            0, H.randomNumber({
              min: 10,
              max: 50
            })
          ]),
          instructor: this.generateTeacher(),
          type: H.randomize(['moderated', 'self-paced']),
          dualCredit: H.randomize([true, false]),
          beginDate: this.generateBeginDate(),
          endDate: this.generateEndDate(),
          seats: (seats = H.randomize([25, 35, 50, 75, 100])),
          seatsTaken: seats * .8,
          gradeLevel: H.randomize(['8', '9', '10', '11', '12', 'Higher Ed.']),
          certsAcceptedBy: [H.randomize(this.models.schools.all()), H.randomize(this.models.schools.all()), H.randomize(this.models.schools.all())]
        };
      };

      return CourseFactory;

    })(MockModelFactory);
    ResourceFactory = (function(_super) {
      __extends(ResourceFactory, _super);

      function ResourceFactory() {
        return ResourceFactory.__super__.constructor.apply(this, arguments);
      }

      ResourceFactory.prototype.generate = function() {
        var object;
        object = {
          id: this.generateId(),
          "class": 'Resource',
          resourceType: H.randomize(['PDF', 'Video', 'PowerPoint', 'Link']),
          title: titleCaseText(words(H.randomNumber({
            min: 1,
            max: 6
          }))),
          description: capitalizeText(sentences(H.randomNumber({
            min: 1,
            max: 5
          }))),
          audience: H.randomize(['student', 'teacher', 'pastor']),
          source: H.randomize(this.models.schools.all()),
          publishedAt: D.recent(365),
          ceu: H.randomize([1, 2, 3])
        };
        if (~['PDF', 'PowerPoint'].indexOf(object.resourceType)) {
          object.file = "/uploads/" + object.resourceType + "/" + (H.randomNumber({
            max: 1000
          }));
        } else {
          object.url = "http://" + (I.domainName()) + "/file/" + (H.randomNumber({
            max: 1000
          }));
        }
        return object;
      };

      return ResourceFactory;

    })(MockModelFactory);
    ContentPageFactory = (function(_super) {
      __extends(ContentPageFactory, _super);

      function ContentPageFactory() {
        return ContentPageFactory.__super__.constructor.apply(this, arguments);
      }

      ContentPageFactory.prototype.generate = function() {
        return {
          id: this.generateId(),
          "class": 'ContentPage',
          title: titleCaseText(words(H.randomNumber({
            min: 1,
            max: 6
          }))),
          description: capitalizeText(sentences(H.randomNumber({
            min: 1,
            max: 3
          }))),
          audience: H.randomize(['student', 'teacher', 'pastor'])
        };
      };

      return ContentPageFactory;

    })(MockModelFactory);
    CreditFactory = (function(_super) {
      __extends(CreditFactory, _super);

      function CreditFactory() {
        return CreditFactory.__super__.constructor.apply(this, arguments);
      }

      CreditFactory.prototype.generate = function() {
        return {
          title: words(3),
          amount: H.randomNumber({
            min: 1,
            max: 3
          }),
          date: D.recent(365)
        };
      };

      return CreditFactory;

    })(MockModelFactory);
    defaultCount = 100;
    mockModels = {};
    _.merge(mockModels, {
      churches: new ChurchFactory(defaultCount, mockModels),
      conferences: new ConferenceFactory(12, mockModels),
      contentPages: new ContentPageFactory(defaultCount, mockModels),
      courses: new CourseFactory(defaultCount, mockModels),
      resources: new ResourceFactory(defaultCount, mockModels),
      schools: new SchoolFactory(defaultCount, mockModels),
      unions: new UnionFactory(5, mockModels),
      users: new UserFactory(50, mockModels),
      credits: new CreditFactory(10, mockModels)
    });
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
    $httpBackend.whenPOST('/resource/ceu_request').respond({});
    return params = function(url) {
      return $.parseParams(url);
    };
  });

}).call(this);

//# sourceMappingURL=../../maps/alc-wire/services/mocks.js.map