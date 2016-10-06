'use strict';

var app = angular.module('angularFlaskServices', ['ngResource']);


app.factory('Post', function($resource) {
		return $resource('/api/post/:postId', {}, {
			query: {
				method: 'GET',
				params: { postId: '' },
				isArray: true
			}
		});
	});

app.service('ReportService', function($http, $q) {

	this.getReport = function(reportId){
        return $http.get('/load/reports/' + reportId);
    };

    this.patchReport = function(reportId, reportJson){
    	var data = {report_json: JSON.stringify(reportJson)};
        return $http.patch('/load/reports/' + reportId, data);
    };

    this.resetReport = function(reportId){
        return $http.get('/reset/reports/' + reportId);
    };

});



