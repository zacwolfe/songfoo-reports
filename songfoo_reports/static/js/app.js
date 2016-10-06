'use strict';

angular.module('AngularFlask', ['ngRoute','angularFlaskServices'])
	.config(['$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'static/partials/landing.html',
			controller: IndexController
		})
		.when('/about', {
			templateUrl: 'static/partials/about.html',
			controller: AboutController
		})
		.when('/post', {
			templateUrl: 'static/partials/post-list.html',
			controller: PostListController
		})
		.when('/post/:postId', {
			templateUrl: '/static/partials/post-detail.html',
			controller: PostDetailController
		})
		/* Create a "/blog" route that takes the user to the same place as "/post" */
		.when('/blog', {
			templateUrl: 'static/partials/post-list.html',
			controller: PostListController
		})
		.when('/reports', {
			templateUrl: 'static/partials/reports.html',
			controller: ReportController
		})
		.otherwise({
			redirectTo: '/'
		})
		;

		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
	}])
;