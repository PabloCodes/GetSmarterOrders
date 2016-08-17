var app = angular.module('OrdersApp', ['ngRoute', 'firebase']);

app.config(function($routeProvider){
  $routeProvider.when('/', {
    controller: 'OrdersListCtrl',
    templateUrl: 'templates/orders_list.html'
  }).when('/:orderID', {
    controller: 'CurrentOrderCtrl',
    templateUrl: 'templates/current_order.html'
  })
})

app.controller('CurrentOrderCtrl', function($scope, $firebaseArray, $routeParams){
  $scope.isHome = true;
  $scope.atAccount = false;
  $scope.isSignedIn = true;
  $scope.mustSignIn = false;

  var ref = firebase.database().ref().child("orders");
  $scope.orders = $firebaseArray(ref);

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