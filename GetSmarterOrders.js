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
  }).when('/myaccount', {
    controller: 'AccountCtrl',
    templateUrl: 'templates/account.html',
    resolve: {
          "currentAuth": function($firebaseAuth) {
              return $firebaseAuth().$requireSignIn();
          }
      }
  }).when('/:orderID', {
    controller: 'CurrentOrderCtrl',
    templateUrl: 'templates/current_order.html',
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

app.controller('CurrentOrderCtrl', function($scope, $firebaseArray, $routeParams, currentAuth, $firebaseObject){

  $scope.uid = currentAuth.uid;
  $scope.currUserName = currentAuth.displayName;
  // console.log($scope.uid);

  var order_ref = firebase.database().ref().child("orders");
  $scope.orders = $firebaseArray(order_ref);
  // console.log($scope.orders);

  var this_order = firebase.database().ref().child("orders").child($routeParams.orderID);
  $scope.thisOrder = $firebaseObject(this_order);
  // console.log($scope.thisOrder);

  var ref = firebase.database().ref().child("orderItems").child($routeParams.orderID);
  $scope.orderItems = $firebaseArray(ref);

  var user_ref=firebase.database().ref().child("users").child($scope.uid)
  $scope.user=$firebaseArray(user_ref);

  // console.log($scope.user);

  $scope.addOrderItem = function(){
    $scope.orderItems.$add({
      item: $scope.item,
      cost: $scope.cost,
      name: $scope.currUserName,
      created_by: $scope.uid
    });

// Find a way to define userOrders inside of the current user for future account page
    var user_orders_ref=firebase.database().ref().child("users").child($scope.uid).child("userOrders");
    $scope.userOrders=$firebaseArray(user_orders_ref);

    $scope.userOrders.$add({
      date: $scope.thisOrder.date,
      cost: $scope.cost,
      owed_to: $scope.thisOrder.name
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
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      var user = result.user;

      var currUser_ref = firebase.database().ref().child("users").child(user.uid);
      $scope.currUser = $firebaseObject(currUser_ref);

      console.log(user);
      console.log($scope.currUser);
      console.log($scope.currUser.$id);
      console.log(user.uid);

      $scope.currUser.name = user.displayName;
      $scope.currUser.email = user.email;
     
      $scope.currUser.$save();

      // bring back to home page
      window.location.href="#/";

    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
    // see google API for oAuth if you have questions
    });
  }
})

app.controller('AccountCtrl', function($scope, $firebaseAuth, $firebaseArray, currentAuth){
  $scope.uid = currentAuth.uid;
  var user_ref=firebase.database().ref().child("users").child($scope.uid)
  $scope.user=$firebaseArray(user_ref);
  var user_orders_ref=firebase.database().ref().child("users").child($scope.uid).child("userOrders");
  $scope.userOrders=$firebaseArray(user_orders_ref);
})







