var app = angular.module('OrdersApp', ['ngRoute', 'firebase']);

app.config(function($routeProvider){
  $routeProvider.when('/', {
    controller: 'OrdersListCtrl',
    templateUrl: 'templates/orders_list.html',
    resolve: {
          "currentAuth": function($firebaseAuth) {
              return $firebaseAuth().$requireSignIn();
          }
      }
  }).when('/signin', {
    controller: 'SignInCtrl',
    templateUrl: 'templates/sign_in.html'
  }).when('/:orderID', {
    controller: 'CurrentOrderCtrl',
    templateUrl: 'templates/current_order.html',
    resolve: {
          "currentAuth": function($firebaseAuth) {
              return $firebaseAuth().$requireSignIn();
          }
      }
  }).when('/myaccount', {
    controller: 'AccountCtrl',
    templateUrl: 'templates/account.html',
    resolve: {
          "currentAuth": function($firebaseAuth) {
              return $firebaseAuth().$requireSignIn();
          }
      }
  })
})

app.run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $location.path("/signin");
    }
  });
}]);

app.controller('CurrentOrderCtrl', function($scope, $firebaseArray, $routeParams, currentAuth){

  $scope.uid = currentAuth.uid;
  $scope.currUserName = currentAuth.displayName;

  var order_ref = firebase.database().ref().child("orders");
  $scope.orders = $firebaseArray(order_ref);
  console.log($scope.orders);

  $scope.currentOrder = function(){
  // $(window).load(function() {
    for (var i=0; i<$scope.orders.length; i++){
      if ($scope.orders[i].$id === $routeParams.orderID){
        $scope.thisOrder = $scope.orders[i]
        console.log($scope.thisOrder);
        return $scope.thisOrder;
      }
    }
  } 

  var ref = firebase.database().ref().child("orderItems").child($routeParams.orderID);
  $scope.orderItems = $firebaseArray(ref);

  var user_ref=firebase.database().ref().child("users").child($scope.uid)
  $scope.user=$firebaseArray(user_ref);

  var user_orders_ref=firebase.database().ref().child("users").child($scope.uid).child("userOrders");
  $scope.userOrders=$firebaseArray(user_orders_ref);

  console.log($scope.user);

  $scope.addOrderItem = function(){
    console.log("Did it click?");
    $scope.orderItems.$add({
      item: $scope.item,
      cost: $scope.cost,
      name: $scope.currUserName,
      created_by: $scope.uid
    });

// Find a way to define userOrders inside of the current user for future account page
    
    $scope.userOrders.$add({
      date: $scope.orders.date,
      cost: $scope.cost,
      // owed_to: $scope.thisOrder.name
    });
  }

})

app.controller('OrdersListCtrl', function($scope, $firebaseArray, $firebaseObject, currentAuth){

  $scope.userName = currentAuth.displayName;
  $scope.uid = currentAuth.uid

  var ref = firebase.database().ref().child("orders");
  $scope.orders = $firebaseArray(ref);

  $scope.newOrderList = function(){
    // console.log("The button works!")

    $scope.orders.$add({
      date: $scope.date,
      restaurant: $scope.restaurant,
      website: $scope.website,
      created_by: $scope.uid,
      name: $scope.userName
    });

  }

})

app.controller('SignInCtrl', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject){
  var provider = new firebase.auth.GoogleAuthProvider();
  var users_ref = firebase.database().ref().child("users");
  $scope.users = $firebaseArray(users_ref);


  $scope.userLogin = function(){
      console.log("entered function");
    $scope.authObj = $firebaseAuth();
    console.log($scope.authObj);
    $scope.authObj.$signInWithPopup(provider)
    .then(function(firebaseUser) {
        console.log("Signed in as:", firebaseUser);
        // var user = result.user;
        window.location.href="#/";
    }).catch(function(error) {
        console.error("Authentication failed:", error);
    });
  }

})

app.controller('AccountCtrl', function($scope, $firebaseAuth, $firebaseArray){

})







