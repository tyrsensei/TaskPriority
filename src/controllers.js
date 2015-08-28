var taskPriorityControllers = angular.module('TaskPriorityControllers', []);

taskPriorityControllers.controller('CalendarCtrl', ['$scope', '$http', '$log', 'Task',
    function($scope, $http, $log, Task) {
        var jour_courant = moment().startOf('month').startOf('week').startOf('day');
        var dernier_jour = moment().endOf('month').endOf('week').endOf('day');

        $scope.days = [];

        while (!jour_courant.isAfter(dernier_jour, 'day')) {
            $scope.days.push({date: jour_courant.format('DD/MM/YYYY'), 'tasks': 5, 'time': 180});

            jour_courant.add(1, 'd');
        }

        Task.calendar();
    }
]);

taskPriorityControllers.controller('DateCtrl', ['$scope', '$routeParams', '$http', '$log', 'filterFilter',
    function($scope, $routeParams, $http, $log, filterFilter) {
        $scope.tasks = [
            {'id': 1, 'label': 'Une tâche de test 1', 'urgent': true, 'important': true, 'done': false, 'time': 30},
            {'id': 2, 'label': 'Une tâche de test 2', 'urgent': false, 'important': false, 'done': false, 'time': 30},
            {'id': 3, 'label': 'Une tâche de test 3', 'urgent': true, 'important': true, 'done': true, 'time': 30},
            {'id': 4, 'label': 'Une tâche de test 4', 'urgent': false, 'important': true, 'done': false, 'time': 30},
            {'id': 5, 'label': 'Une tâche de test 5', 'urgent': false, 'important': false, 'done': false, 'time': 30},
            {'id': 6, 'label': 'Une tâche de test 6', 'urgent': true, 'important': false, 'done': true, 'time': 30},
            {'id': 7, 'label': 'Une tâche de test 7', 'urgent': true, 'important': true, 'done': true, 'time': 30},
            {'id': 8, 'label': 'Une tâche de test 8', 'urgent': true, 'important': true, 'done': false, 'time': 30},
            {'id': 9, 'label': 'Une tâche de test 9', 'urgent': false, 'important': true, 'done': false, 'time': 30},
            {'id': 10, 'label': 'Une tâche de test 10', 'urgent': true, 'important': false, 'done': false, 'time': 30}
        ];
        $scope.tasksUI = filterFilter($scope.tasks, {'urgent': true, 'important': true});
        $scope.tasksuI = filterFilter($scope.tasks, {'urgent': false, 'important': true});
        $scope.tasksUi = filterFilter($scope.tasks, {'urgent': true, 'important': false});
        $scope.tasksui = filterFilter($scope.tasks, {'urgent': false, 'important': false});

        $scope.onSorted = function($item, $partTo) {
            var dest = filterFilter($partTo, !$item)[0];
            $item.urgent = dest.urgent;
            $item.important = dest.important;
        };
    }
]);