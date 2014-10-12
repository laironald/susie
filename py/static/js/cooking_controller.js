var app = angular.module('cooking', [
  'ngRoute'
]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    controller:'HomeController',
    templateUrl:'index_home.html'
  }).when('/user', {
    controller:'UserController',
    templateUrl:'index_user.html'
  }).when('/action', {
    controller:'ActionController',
    templateUrl:'index_action.html'
  }).when('/analysis', {
    controller:'AnalysisController',
    templateUrl:'index_analysis.html'
  }).otherwise({
    redirectTo:'/'
  });
}]);


app.controller("CookingController", ['$scope', '$rootScope', function($scope, $rootScope) {
  $scope.item = "hello";
}]);

