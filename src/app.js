'use strict';

var taskApp = angular.module('TaskPriority', [
    'ngRoute',
    'ngMaterial',
    'ngResource',
    'TaskPriorityControllers',
    'angular-sortable-view'
]);

taskApp.config(['$routeProvider', '$mdThemingProvider', '$mdDateLocaleProvider',
    function($routeProvider, $mdThemingProvider, $mdDateLocaleProvider) {
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

        $mdDateLocaleProvider.months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        $mdDateLocaleProvider.shortMonths = ['janv', 'févr', 'mars', 'avril', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
        $mdDateLocaleProvider.days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        $mdDateLocaleProvider.shortDays = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
        $mdDateLocaleProvider.firstDayOfWeek = 1;
        $mdDateLocaleProvider.msgCalendar = 'Calendrier';
        $mdDateLocaleProvider.msgOpenCalendar = 'Ouvrir le calendrier';

        $mdDateLocaleProvider.parseDate = function(dateString) {
            var m = moment(dateString, 'YYYY-MM-DD', true);
            return m.isValid() ? m.toDate() : new Date(NaN);
        };
        $mdDateLocaleProvider.formatDate = function(date) {
            return moment(date).format('DD/MM/YYYY');
        };
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