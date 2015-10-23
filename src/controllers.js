var taskPriorityControllers = angular.module('TaskPriorityControllers', []);

taskPriorityControllers.controller('CalendarCtrl', ['$scope', '$http', '$log', 'Task',
    function($scope, $http, $log, Task) {
        var jour_courant = moment().startOf('month').startOf('week').startOf('day');
        var dernier_jour = moment().endOf('month').endOf('week').endOf('day');

        $scope.days = [];

        while (!jour_courant.isAfter(dernier_jour, 'day')) {
            $scope.days.push({date: jour_courant.format('YYYY-MM-DD'), 'tasks': 5, 'time': 180});

            jour_courant.add(1, 'd');
        }

        Task.calendar();
    }
]);

taskPriorityControllers.controller('DateCtrl', [
    '$scope', '$routeParams', '$http', '$log', 'filterFilter', '$mdDialog', 'Task',
    function($scope, $routeParams, $http, $log, filterFilter, $mdDialog, Task) {
        var dialog;
        $scope.date = $routeParams.date;
        $scope.tasks = [];

        // Récupération de la liste des tâches du jour
        Task.list({date: $scope.date}, function(data){
            angular.forEach(data, function(item){
                if (item._id) {
                    $scope.tasks.push(item);
                }
            });
            $scope.tasksUI = filterFilter($scope.tasks, {'urgent': true, 'important': true});
            $scope.tasksuI = filterFilter($scope.tasks, {'urgent': false, 'important': true});
            $scope.tasksUi = filterFilter($scope.tasks, {'urgent': true, 'important': false});
            $scope.tasksui = filterFilter($scope.tasks, {'urgent': false, 'important': false});
        });

        // Déplacement d'une tâche
        $scope.onSorted = function($item) {
            if (filterFilter($scope.tasksUI, {_id: $item._id}).length) {
                $item.urgent = true;
                $item.important = true;
            }
            if (filterFilter($scope.tasksuI, {_id: $item._id}).length) {
                $item.urgent = false;
                $item.important = true;
            }
            if (filterFilter($scope.tasksUi, {_id: $item._id}).length) {
                $item.urgent = true;
                $item.important = false;
            }
            if (filterFilter($scope.tasksui, {_id: $item._id}).length) {
                $item.urgent = false;
                $item.important = false;
            }
            $scope.updateTask($item);
            $log.log($scope.tasks);
        };

        // Création/Modification d'une tâche
        $scope.editDialog = function(e, task) {
            var options = {
                controller: 'DialogCtrl',
                targetEvent: e,
                templateUrl: '/views/edit_task_dialog.html',
                clickOutsideToClose: true,
                locals: {
                    date: $scope.date
                }
            };
            if (undefined !== task) {
                options.locals.currentTask = filterFilter($scope.tasks, {'_id': task})[0];
            } else {
                options.locals.currentTask = undefined;
            }
            dialog = $mdDialog.show(options).then(function(modifiedTask){
                $log.log($scope.tasks);
                $log.log($scope.tasksUI);
                $log.log($scope.tasksuI);
                $log.log($scope.tasksUi);
                $log.log($scope.tasksui);
            });
        };

        // Mise à jour de la tâche
        $scope.updateTask = function(task) {
            Task.update(task);
        };
    }
]);

// Gestion de la fenêtre de dialog
taskPriorityControllers.controller('DialogCtrl', [
    '$scope', '$mdDialog', 'currentTask', '$log', 'Task', 'date',
    function($scope, $mdDialog, currentTask, $log, Task, date) {
        $scope.task = currentTask;
        $scope.date = date;
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.save = function() {
            if (undefined === $scope.task._id) {
                $scope.task.date = $scope.date;
                Task.create($scope.task);
            } else {
                Task.update($scope.task);
            }
            $mdDialog.hide($scope.task);
        };
    }
]);