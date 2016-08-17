var app = angular.module('OrdersApp', ['ngRoute', 'firebase']);

app.config(function($routeProvider){
  $routeProvider.when('/', {
    controller: 'OrdersListCtrl',
    templateUrl: 'templates/orders_list.html'
  }).when('/CurrentOrder', {
    controller: 'CurrentOrderCtrl',
    templateUrl: 'templates/current_order.html'
  })
})

app.controller('CurrentOrderCtrl', function($scope, $firebaseArray){
  isHome = true;
  atAccount = false;
  isSignedIn = true;
  mustSignIn = false;

})

app.controller('OrdersListCtrl', function($scope, $firebaseArray){
  isHome = true;
  atAccount = false;
  isSignedIn = true;
  mustSignIn = false;

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