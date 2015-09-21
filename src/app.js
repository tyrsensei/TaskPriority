'use strict';

var taskApp = angular.module('TaskPriority', [
    'ngRoute',
    'ngMaterial',
    'ngResource',
    'TaskPriorityControllers',
    'angular-sortable-view'
]);

taskApp.config(['$routeProvider', '$mdThemingProvider',
    function($routeProvider, $mdThemingProvider) {
        $routeProvider.
            when('/calendar', {
                templateUrl: 'views/calendar.html',
                controller: 'CalendarCtrl'
            }).
            when('/:date', {
                templateUrl: 'views/date.html',
                controller: 'DateCtrl'
            }).
            otherwise({
                redirectTo: '/calendar'
            });

        $mdThemingProvider.theme('default')
            .primaryPalette('purple');
    }
]);

taskApp.factory('Task', ['$resource',
    function ($resource) {
        return $resource('/api/tasks/:date', null, {
            'calendar': {method: 'GET', isArray: true},
            'create': {method: 'POST'},
            'list': {method: 'GET', isArray: true},
            'update': {method: 'PUT'}
        });
    }
]);