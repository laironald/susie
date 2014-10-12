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
  $scope.Config = {
    devices: []
  };
  $scope.Main = "ready?";
  $scope.Status = "get started";
  $scope.CustomMain = "";
  $scope.CustomStatus = "shake it up";
  $scope.Processing = false;
  $scope.pushed = function(action) {
    $rootScope.$broadcast("PUSH-ACTION", { action: action });
  };
  $scope.overlay = function(overlay) {
    $rootScope.toggle(overlay, 'on');
  };

  // ROOTSCOPE
  $rootScope.$on("PUSH-ACTION", function(evt, args) {
    var action = args.action;
    console.log(args);
    if (action == 'on' || action == 'off') {
      if (args.status || !$scope.arduino_connected) {
        $scope.Main = args.action;
        if (args.status) {
          $scope.Status = args.status;          
          $scope.Processing = false;
        } else {
          $scope.Processing = true;
        }
      } else {
        if ($scope.Main !== action && !$scope.Processing) {
          $scope.Processing = true;
          $scope.Main = action;
          Model.show('api/push', action).success(function(res) {
            $scope.Status = res;
            $scope.Processing = false;
          });
        }
      }
      $rootScope.$broadcast("ON-SWITCH", { action: action });
    } else {
      if (args.status || !$scope.arduino_connected) {
        $scope.CustomMain = args.action;
        if (args.status) {
          $scope.CustomStatus = args.status;
          $scope.Processing = false;
        } else {
          $scope.Processing = true;
        }
      } else {
        if ($scope.CustomMain !== action && !$scope.Processing) {
          $scope.Processing = true;
          $scope.CustomMain = action;
          Model.show('api/push', action).success(function(res) {
            $scope.CustomStatus = res;
            $scope.Processing = false;
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
      $rootScope.$broadcast("PUSH-ACTION", data);
    });
  });
  /* initialize Arduino */
  $scope.channel.bind('INIT-EVENT', function(data) {
    $scope.$apply(function() {
      $rootScope.$broadcast("PUSH-ACTION", data);
    });
  });
}]);


app.controller("MainController", ['$scope', '$rootScope', 'Model', function($scope, $rootScope, Model) {
  function initialize() {
    if ($scope.Main == 'on') {
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
    var action = ($scope.on) ? 'on' : 'off';
    if (!$scope.arduino_connected)
      Model.show('api/push', action);
    $rootScope.$broadcast("PUSH-ACTION", { action: action });
  };
  // ROOTSCOPE
  $rootScope.$on("ON-SWITCH", function(evt, args) {
    $scope.toggleOn(args.action);
  });

}]);


app.controller("CustomController", ['$scope', '$rootScope', 'Model', function($scope, $rootScope, Model) {
  $scope.customFinish = function() {
    var action = $scope.custom_text;
    if (!$scope.arduino_connected)
      Model.show('api/push', action);    
    $rootScope.$broadcast("PUSH-ACTION", { action: action });
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

