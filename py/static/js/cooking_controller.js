// checkout: http://mobileangularui.com/

var app = angular.module('cooking', [
  'ngRoute',
  'mobile-angular-ui'
]).config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    controller:'MainController',
    templateUrl:'index_main.html'
  }).when('/custom', {
    controller:'CustomController',
    templateUrl:'index_custom.html'
  }).otherwise({
    redirectTo:'/'
  });
}]);



/* CONTROLLERS */

app.controller("CookingController", ['$scope', '$rootScope', 'Model', function($scope, $rootScope, Model) {
  // variable called arduino_connected
  $scope.main = "ready?";
  $scope.status = "get started";
  $scope.custom_main = "";
  $scope.custom_status = "shake it up";
  $scope.processing = false;
  $scope.pushed = function(action) {
    $rootScope.$broadcast("PUSH-ACTION", { action: action });
  };
  $scope.overlay = function(overlay) {
    $rootScope.toggle(overlay, 'on');
  };

  // ROOTSCOPE
  $rootScope.$on("PUSH-ACTION", function(evt, args) {
    var action = args.action;
    if (!$scope.processing) {
      if (action == 'on' || action == 'off') {
        if ($scope.main !== action) {
          $scope.processing = true;
          $scope.main = action;
          $rootScope.$broadcast("ON-SWITCH", { action: action });
          Model.show('api/push', action).success(function(res) {
            $scope.status = res;
            $scope.processing = false;
          });
        }
      } else {
        if ($scope.custom_main !== action) {
          $scope.processing = true;
          $scope.custom_main = action;
          Model.show('api/push', action).success(function(res) {
            $scope.custom_status = res;
            $scope.processing = false;
          });
        }
      }

    }
  });

  // PUSHER
  $scope.pusher = new Pusher( $('.pusher').data('key') );
  $scope.channel = $scope.pusher.subscribe( $(".pusher").data("channel-name") );
  $scope.channel.bind('PUSH-EVENT', function(data) {
    $scope.$apply(function() {
      $rootScope.$broadcast("PUSH-ACTION", { action: data.main });
    });
  });
}]);


app.controller("MainController", ['$scope', '$rootScope', function($scope, $rootScope) {
  function initialize() {
    if ($scope.main == 'on') {
      $scope.on = true;
    } else {
      $scope.off = true;
    }
  };
  initialize();
  $scope.toggleOn = function(action) {
    if (action == 'on' || action == 'off') {
      $scope.on = (action == 'on');
    }
  };
  $scope.clickOn = function() {
    if ($scope.on) {
      $rootScope.$broadcast("PUSH-ACTION", { action: 'on' });
    } else {
      $rootScope.$broadcast("PUSH-ACTION", { action: 'off' });
    }
  };

  // ROOTSCOPE
  $rootScope.$on("ON-SWITCH", function(evt, args) {
    $scope.toggleOn(args.action);
  });

}]);


app.controller("CustomController", ['$scope', '$rootScope', function($scope, $rootScope) {
  $scope.customFinish = function() {
    $rootScope.$broadcast("PUSH-ACTION", { action: $scope.custom_text });
  };
}]);



/* FACTORIES */

app.factory('Model', ['$http', function ($http) {
  function Model() {
    this.data = {};
  };
  Model.prototype.create = function(route, data) {
    return $http.post(route, data);
  };
  Model.prototype.index = function(route) {
    return $http.get(route);
  };
  Model.prototype.show = function(route, id) {
    return $http.get(route + '/' + id);
  };
  Model.prototype.update = function(route, id, data) {
    return $http.put(route + '/' + id, data);
  };
  Model.prototype.destroy = function(route, id) {
    return $http['delete'](route + '/' + id);
  };
  return new Model();
}]);

