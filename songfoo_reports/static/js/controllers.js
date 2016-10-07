'use strict';

/* Controllers */

function IndexController($scope) {
	
}

function AboutController($scope) {
	
}

function PostListController($scope, Post) {
	var postsQuery = Post.get({}, function(posts) {
		$scope.posts = posts.objects;
	});
}

function PostDetailController($scope, $routeParams, Post) {
	var postQuery = Post.get({ postId: $routeParams.postId }, function(post) {
		$scope.post = post;
	});
}

function ReportController(
    $scope,
    ReportService) {

    $scope.reports = [
        {name: 'Revenue By Venue Type',id:'line_report_1', stock: false},
        {name: 'Total Revenue Trend',id:'line_report_2', stock: true},
        {name: 'Song Genres 1',id:'pie_chart_1', stock: false},
        {name: 'Song Genres 2',id:'pie_chart_2', stock: false},
        {name: 'Songs Per Set',id:'histogram_1', stock: false},
        {name: 'Setlist Funnel',id:'funnel_1', stock: false},
    ];
    $scope.currentReport = null;

    $scope.reportData = {};
    $scope.charts = {};

    $scope.selectReport = function selectReport(report) {
        if (report.id in $scope.reportData && $scope.reportData[report.id] != null) {
            if (report.id in $scope.charts && $scope.charts[report.id] != null) {
                try {
                    $scope.charts[report.id].destroy();
                } catch(err){
                    console.log(err);
                    try {
                        $('#container').highcharts().destroy();
                    } catch(err) {
                        console.log(err);
                    }
                }
            }
            var reportJson = $.extend({}, $scope.reportData[report.id])
            if (report.stock) {
                $scope.charts[report.id] = new Highcharts.StockChart(reportJson);
            }
            else {
                $scope.charts[report.id] = new Highcharts.Chart(reportJson);
            }

            // $scope.charts[report.id] = new Highcharts.Chart(reportJson);
        }
        else {
            $scope.getReport(report);
        }
    };

    $scope.getReport = function getReport(report) {
        var reportId = report.id;
        ReportService.getReport(reportId).then(function (data) {

            if (data.data != null) {

                var dump = JSON.stringify(data.data, null, 2);
                if (dump) {
                    console.log(dump);
                }
                var reportJson = data.data;
                // reportJson.chart.renderTo = reportId;

                reportJson.chart.renderTo = 'container';
                console.log(JSON.stringify(reportJson, null, 2));
                console.log("type of json %s %s",reportJson instanceof String, reportJson instanceof Object);

                $scope.reportData[reportId] = reportJson;

                if (report.stock) {
                    $scope.charts[reportId] = new Highcharts.StockChart(reportJson);
                }
                else {
                    $scope.charts[reportId] = new Highcharts.Chart(reportJson);
                }
            } else {
                alert('Could not load report' + reportId);
            }

        }, function errorHandler(error) {
            console.error(error);
            alert('could not load '+reportId+": "+ error);
        });
    };

    $scope.patchReport = function patchReport(report) {
        var reportJson = $scope.reportData[report.id];
        ReportService.patchReport(report.id, reportJson).then(function (data) {
            var d = data.data;
            if (d == 'success') {

            } else {
                alert('could not save ' + report.id);
            }

            if (data.data != null) {

                var dump = JSON.stringify(data.data, null, 2);
                if (dump) {
                    console.log(dump);
                }
                $scope.charts[report.id] = data.data;
            } else {
                alert('Could not load report' + report.id);
            }

        }, function errorHandler(error) {

            console.error(error);
            alert('could not load '+report.id+": "+ error);
        });
    };

    $scope.resetReport = function resetReport(report) {
        ReportService.resetReport(report.id).then(function (data) {

            if (data.data != null) {

                var dump = JSON.stringify(data.data, null, 2);
                if (dump) {
                    console.log(dump);
                }
                var reportJson = data.data;
                reportJson.chart.renderTo = 'container';
                // reportJson.chart.renderTo = reportId;

                console.log(JSON.stringify(reportJson, null, 2));

                $scope.reportData[report.id] = $.extend({}, reportJson);

                if (report.id in $scope.charts && $scope.charts[report.id] != null) {
                    try {
                        $scope.charts[report.id].destroy();
                    } catch (err) {}
                }
                $scope.charts[report.id] = new Highcharts.Chart(reportJson);
            } else {
                alert('Could not load report' + report.id);
            }

        }, function errorHandler(error) {
            console.error(error);
            alert('could not load '+report.id+": "+ error);
        });
    };

    // var init = function init() {
    //   angular.forEach($scope.reportIds, function (reportId) {
    //       $scope.getReport(reportId);
    //   });
    // };
    //
    // init();


}
