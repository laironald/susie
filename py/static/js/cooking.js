// checkout: http://mobileangularui.com/
// switch this to ionic soon

var app = angular.module('cooking', [
  'ngRoute',
  'mobile-angular-ui',
  'firebase'
]);

// routes

app.config(['$routeProvider', function($routeProvider) {
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

app.controller("CookingController", ['$scope', '$firebase', '$rootScope', 'Model', function($scope, $firebase, $rootScope, Model) {

  // variable called ArduinoConnected
  // sessionStorage.Config = JSON.stringify($scope.Config);
  // $scope.Config = $.parseJSON(sessionStorage.Config);
  function initialize() {

    var ref = new Firebase("https://glaring-heat-8025.firebaseio.com/config");
    var sync = $firebase(ref);
    var syncObject = sync.$asObject();
    syncObject.$bindTo($scope, "config");
    syncObject.$loaded(function(data) {
      if ('$value' in data && data.$value == null) {
        sync.$set({ 
          main: 'ready?',
          status: 'get started',
          customMain: '',
          customStatus: 'shake it up',
          on: false
        });
      } else {
        $scope.config.on = ($scope.config.main == 'on');
      }
    });

    $scope.Config = {
      me: null,
      devices: [],
      selectedDevice: null,
      sketches: [],
      selectedSketch: null
    };
    $scope.AnyConnected = true;
    $scope.Processing = false;
    Model.index('api/sketches').success(function(data) {
      $scope.Config.sketches = data;
    });
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
        $scope.config.main = args.action;
        if (args.status) {
          $scope.config.status = args.status;          
          $scope.Processing = false;
        } else {
          $scope.Processing = true;
        }
      } else {
        if ($scope.config.main !== action && !$scope.Processing) {
          $scope.Processing = true;
          $scope.config.main = action;
          Model.show('api/push', action).success(function(res) {
            $scope.config.status = res;
            $scope.Processing = false;
          });
        }
      }
      $rootScope.$broadcast("ON-SWITCH", { action: action });
    } else {
      if (args.status || !$scope.ArduinoConnected) {
        $scope.config.customMain = args.action;
        if (args.status) {
          $scope.config.customStatus = args.status;
          $scope.Processing = false;
        } else {
          $scope.Processing = true;
        }
      } else {
        if ($scope.config.customMain !== action && !$scope.Processing) {
          $scope.Processing = true;
          $scope.config.customMain = action;
          Model.show('api/push', action).success(function(res) {
            $scope.config.customStatus = res;
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
  $scope.toggleOn = function(action) {
    if (action == 'on' || action == 'off') {
      $scope.config.on = (action == 'on');
    }
  };
  $scope.clickOn = function() {
    var action = ($scope.config.on) ? 'on' : 'off';
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
  $scope.selectSketch = function(sketch) {
    var action = $scope.customText;
    $scope.loadingSketch = true;
    if ($scope.ArduinoConnected)
      Model.show('api/sketches', sketch).success(function(data) {
        $scope.Config.selectedSketch = sketch;
        $scope.loadingSketch = false;
      });
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

