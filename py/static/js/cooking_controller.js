// checkout: http://mobileangularui.com/

var app = angular.module('cooking', [
  'ngRoute'
]);

app.config(['$routeProvider', function($routeProvider) {
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
  $rootScope.$on("CHANGE_PAGE", function(evt, args) {
    $scope.page = args.page;
  });
}]);

app.controller("MainController", ['$scope', '$rootScope', 'Model', function($scope, $rootScope, Model) {
  $rootScope.$broadcast("CHANGE_PAGE", { page: "home" });
  $scope.main = "main";
  $scope.processing = false;

  // ---------------------- //

  $scope.pusher = new Pusher( $('.pusher').data('key') );
  $scope.channel = $scope.pusher.subscribe( $(".pusher").data("channel-name") );
  $scope.channel.bind('PUSH-EVENT', function(data) {
    $scope.$apply(function() {
      if ($scope.main !== data.main && !$scope.processing) {
        $scope.processing = true;
        $scope.main = data.main;
        Model.show('push', data.main).success(function(res) {
          $scope.status = res;
          $scope.processing = false;
        });
      }
    });
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

