// checkout: http://mobileangularui.com/

var app = angular.module('cooking', [
  'ngRoute',
  'mobile-angular-ui'
]).config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    controller:'MainController',
    templateUrl:'main.html'
  }).when('/custom', {
    controller:'CustomController',
    templateUrl:'custom.html'
  }).when('/arduinos', {
    controller:'ArduinosController',
    templateUrl:'arduinos.html'
  }).otherwise({
    redirectTo:'/'
  });
}]);



/* CONTROLLERS */

app.controller("CookingController", ['$scope', '$rootScope', 'Model', function($scope, $rootScope, Model) {
  // variable called ArduinoConnected
  function initialize() {
    // sessionStorage.Config = JSON.stringify($scope.Config);
    // $scope.Config = $.parseJSON(sessionStorage.Config);

    $scope.Config = {
      me: null,
      devices: [],
      selectedDevice: null
    };

    $scope.AnyConnected = true;
    $scope.Main = "ready?";
    $scope.Status = "get started";
    $scope.CustomMain = "";
    $scope.CustomStatus = "shake it up";
    $scope.Processing = false;
  }
  initialize();

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
      if (args.status || !$scope.ArduinoConnected) {
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
      if (args.status || !$scope.ArduinoConnected) {
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
  $scope.pusher = new Pusher( $('.pusher').data('key'), {
    authEndpoint: '/api/auth'
  });
  $scope.publicChannel = $scope.pusher.subscribe( $(".pusher").data('public') );
  $scope.presenceChannel = $scope.pusher.subscribe( $(".pusher").data('presence') );

  $scope.publicChannel.bind('PUSH-EVENT', function(data) {
    $scope.$apply(function() {
      $rootScope.$broadcast("PUSH-ACTION", data);
    });
  });
  $scope.presenceChannel.bind('pusher:member_removed', function(member) {
    $scope.$apply(function() {
      $scope.AnyConnected = false;
      $scope.Config.devices.splice($scope.Config.devices.indexOf(member), 1);
      _.each($scope.Config.devices, function(device) {
        if (device.arduino) {
          $scope.AnyConnected = true;
        }
      });
    });
  });
  $scope.presenceChannel.bind('pusher:member_added', function(member) {
    $scope.$apply(function() {
      $scope.Config.devices.push(member);
      if (member.info.arduino) {
        $scope.AnyConnected = true;
      }
    });
  });
  $scope.presenceChannel.bind('pusher:subscription_succeeded', function(members) {
    $scope.$apply(function() {
      $scope.AnyConnected = false;
      $scope.Config.me = members.me;
      $scope.Config.devices = [ members.me ];
      members.each(function(member) {
        if (member.info != members.me.info) {
          $scope.Config.devices.push(member);
        }
        if (member.info.arduino) {
          $scope.AnyConnected = true;
        }
      });
    });
  });

}]);


app.controller("MainController", ['$scope', '$rootScope', 'Model', function($scope, $rootScope, Model) {
}]);

app.controller("CustomController", ['$scope', '$rootScope', 'Model', function($scope, $rootScope, Model) {
  function initialize() {
    $scope.on = ($scope.Main == 'on');
  };
  initialize();
  $scope.toggleOn = function(action) {
    if (action == 'on' || action == 'off') {
      $scope.on = (action == 'on');
    }
  };
  $scope.clickOn = function() {
    var action = ($scope.on) ? 'on' : 'off';
    if (!$scope.ArduinoConnected)
      Model.show('api/push', action);
    $rootScope.$broadcast("PUSH-ACTION", { action: action });
  };
  $scope.customFinish = function() {
    var action = $scope.customText;
    if (!$scope.ArduinoConnected)
      Model.show('api/push', action);    
    $rootScope.$broadcast("PUSH-ACTION", { action: action });
  };
  // ROOTSCOPE
  $rootScope.$on("ON-SWITCH", function(evt, args) {
    $scope.toggleOn(args.action);
  });
}]);

app.controller("ArduinosController", ['$scope', '$rootScope', 'Model', function($scope, $rootScope, Model) {
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

