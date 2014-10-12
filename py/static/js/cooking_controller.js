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


app.controller("CookingController", ['$scope', '$rootScope', function($scope, $rootScope) {
  $rootScope.$on("CHANGE_PAGE", function(evt, args) {
    $scope.page = args.page;
  });
}]);

app.controller("MainController", ['$scope', '$rootScope', function($scope, $rootScope) {
  $rootScope.$broadcast("CHANGE_PAGE", { page: "home" });
  $scope.main = "main";
}]);

