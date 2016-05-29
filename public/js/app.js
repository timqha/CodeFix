var myApp = angular.module('myApp', ['ui.router']);
myApp.controller('mainController', function($scope, $http) {
    $scope.formData = {};
    $scope.posts;
    // when landing on the page, get all posts and show them
    $http.get('/api/posts')
        .success(function(data) {
            $scope.posts = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createPost = function() {
        console.log($scope.formData);
        $http.post('/api/posts', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                //$scope.posts = data;
                $scope.posts.push($scope.formData);
                console.log($scope.posts);
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

    };

    // delete a post after checking it
    $scope.deletePost = function(id) {
        console.log(id);
        $http.delete('/api/post/'+id)
            .success(function(data) {
                console.log(data);
                //$scope.posts = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

});

myApp.config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/index");
    //
    // Now set up the states
    $stateProvider
        .state('about', {
            url: "/about",
            templateUrl: "templates/about.html"
        })
        .state('index', {
            url: "/index",
            templateUrl: "templates/home.html",
            controller: "mainController"
        })
        .state('contact', {
            url: "/contact",
            templateUrl: "templates/contact.html",
            controller: function($scope) {
                $scope.items = ["A", "List", "Of", "Items"];
            }
        })
        .state('services', {
            url: "/services",
            templateUrl: "templates/services.html",
            controller: "mainController"
        })
});