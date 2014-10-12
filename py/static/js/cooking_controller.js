// checkout: http://mobileangularui.com/

var app = angular.module('cooking', [
  'ngRoute',
  'mobile-angular-ui'
]).config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    controller:'MainController',
    templateUrl:'index_main.html'
  }).when('/analysis', {
    controller:'AnalysisController',
    templateUrl:'index_analysis.html'
  }).otherwise({
    redirectTo:'/'
  });
}]);

/* CONTROLLERS */

app.controller("CookingController", ['$scope', '$rootScope', function($scope, $rootScope) {
  $scope.on = false;
  $scope.pushed = function(action) {
    $rootScope.$broadcast("PUSH-ACTION", { action: action });
  };
  $scope.toggleOn = function(action) {
    if (action == 'on' || action == 'off') {
      $scope.on = (action == 'on');
    }
  };
  $scope.overlay = function(overlay) {
    console.log(overlay);
    $rootScope.toggle(overlay, 'on');
  };
  // ROOTSCOPE
  $rootScope.$on("ON-SWITCH", function(evt, args) {
    $scope.toggleOn(args.action);
  });
}]);

app.controller("MainController", ['$scope', '$rootScope', 'Model', function($scope, $rootScope, Model) {
  $scope.main = "main";
  $scope.processing = false;

  // ---------------------- //

  $scope.pushed = function(action) {
    if ($scope.main !== action && !$scope.processing) {
      $scope.processing = true;
      $scope.main = action;
      $rootScope.$broadcast("ON-SWITCH", { action: action });
      Model.show('push', action).success(function(res) {
        $scope.status = res;
        $scope.processing = false;
      });
    }
  };

  // PUSHER
  $scope.pusher = new Pusher( $('.pusher').data('key') );
  $scope.channel = $scope.pusher.subscribe( $(".pusher").data("channel-name") );
  $scope.channel.bind('PUSH-EVENT', function(data) {
    $scope.$apply(function() {
      $scope.pushed(data.main);
    });
  });

  // ROOTSCOPE
  $rootScope.$on("PUSH-ACTION", function(evt, args) {
    $scope.pushed(args.action);
  });

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

