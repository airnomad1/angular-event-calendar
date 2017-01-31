(function (angular) {

    var app = angular.module('app', []);

    app.controller('calendarController', ['$scope', function ($scope) {
        $scope.events = [
            {
                id: 1,
                start: '2017-01-29T08:07:15.636Z',
                end: '2017-01-29T10:07:15.636Z',
                pending: true
            },
            {
                id: 2,
                start: '2017-01-31T04:07:15.636Z',
                end: '2017-01-31T06:07:15.636Z',
                pending: false
            }

        ];
    }]);

})(angular);