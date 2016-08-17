var app = angular.module('OrdersApp', ['ngRoute', 'firebase']);

app.config(function($routeProvider){
  $routeProvider.when('/', {
    controller: 'OrdersListCtrl',
    templateUrl: 'templates/orders_list.html',
    // resolve: {
    //       "currentAuth": function($firebaseAuth) {
    //           return $firebaseAuth().$requireSignIn();
    //       }
    //   }
  }).when('/signin', {
    controller: 'SignInCtrl',
    templateUrl: 'templates/sign_in.html'
  }).when('/:orderID', {
    controller: 'CurrentOrderCtrl',
    templateUrl: 'templates/current_order.html',
    // resolve: {
    //       "currentAuth": function($firebaseAuth) {
    //           return $firebaseAuth().$requireSignIn();
    //       }
    //   }
  })
})

// app.run(["$rootScope", "$location", function($rootScope, $location) {
//   $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
//     // We can catch the error thrown when the $requireSignIn promise is rejected
//     // and redirect the user back to the home page
//     if (error === "AUTH_REQUIRED") {
//       $location.path("/signin");
//     }
//   });
// }]);

app.controller('CurrentOrderCtrl', function($scope, $firebaseArray, $routeParams){
  $scope.isHome = true;
  $scope.atAccount = false;
  $scope.isSignedIn = true;
  $scope.mustSignIn = false;

  var ref = firebase.database().ref().child("orders");
  $scope.orders = $firebaseArray(ref);
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

  $scope.addOrderItem = function(){
    $scope.orderItems.$add({
      item: $scope.item,
      cost: $scope.cost,
      created_by: $scope.name
    });

  }

})

app.controller('OrdersListCtrl', function($scope, $firebaseArray, $firebaseObject){
  $scope.isHome = true;
  $scope.atAccount = false;
  $scope.isSignedIn = true;
  $scope.mustSignIn = false;

  var ref = firebase.database().ref().child("orders");
  $scope.orders = $firebaseArray(ref);

  $scope.newOrderList = function(){
    console.log("The button works!")

    $scope.orders.$add({
      date: $scope.date,
      restaurant: $scope.restaurant,
      website: $scope.website,
      created_by: $scope.created_by
    });
  }

})

app.controller('SignInCtrl', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject){
  var provider = new firebase.auth.GoogleAuthProvider();
  var user_ref = firebase.database().ref().child("users");
  $scope.users = $firebaseArray(user_ref);

  $scope.userLogin = function(){
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      var user = result.user;
      console.log(user);

      $scope.users.$add({
        name: user.displayName,
      })
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









