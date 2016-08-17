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
  }).when('/:orderID', {
    controller: 'CurrentOrderCtrl',
    templateUrl: 'templates/current_order.html',
    // resolve: {
    //       "currentAuth": function($firebaseAuth) {
    //           return $firebaseAuth().$requireSignIn();
    //       }
    //   }
  }).when('/signin', {
    controller: 'SignInCtrl',
    templateUrl: 'templates/sign_in.html'
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
    for (var i=0; i<$scope.orders.length; i++){
      if ($scope.orders[i].$id === $routeParams.orderID){
        $scope.thisOrder = $scope.orders[i]
        console.log($scope.thisOrder);
        return $scope.thisOrder;
      }
    }
  } 

  console.log($scope.thisOrder);

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

app.controller('OrdersListCtrl', function($scope, $firebaseArray){
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

app.controller('SignInCtrl', function($scope, $firebaseAuth){
  var provider = new firebase.auth.GoogleAuthProvider();
  console.log("WHY?!")

  $scope.userLogin = function(){
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
    // ...
    });
  }

    //  function onSignIn(googleUser) {
    //   // Useful data for your client-side scripts:
    //   var profile = googleUser.getBasicProfile();
    //   console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    //   console.log('Full Name: ' + profile.getName());
    //   console.log('Given Name: ' + profile.getGivenName());
    //   console.log('Family Name: ' + profile.getFamilyName());
    //   console.log("Image URL: " + profile.getImageUrl());
    //   console.log("Email: " + profile.getEmail());

    //   // The ID token you need to pass to your backend:
    //   var id_token = googleUser.getAuthResponse().id_token;
    //   console.log("ID Token: " + id_token);
    // };
})









