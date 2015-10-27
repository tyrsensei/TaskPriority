var taskPriorityControllers = angular.module('TaskPriorityControllers', []);

taskPriorityControllers.controller('CalendarCtrl', ['$scope', '$http', '$log', 'Task', 'filterFilter',
    function($scope, $http, $log, Task, filterFilter) {
        var jour_courant = moment().startOf('month').startOf('week').startOf('day');
        var dernier_jour = moment().endOf('month').endOf('week').endOf('day');

        $scope.days = [];

        Task.calendar(null, function(data){
            var tasks = [];
            var tasksOfDay = undefined;

            angular.forEach(data, function(item){
                if (item._id) {
                    tasks.push(item);
                }
            });

            while (!jour_courant.isAfter(dernier_jour, 'day')) {
                var totalTime = 0;
                tasksOfDay = filterFilter(tasks, {'date': jour_courant.toJSON()});
                angular.forEach(tasksOfDay, function(item){
                    totalTime+= parseInt(item.time);
                });
                $scope.days.push({date: jour_courant.clone().toDate(), 'tasks': tasksOfDay.length, 'time': totalTime});

                jour_courant.add(1, 'd');
            }
        });
    }
]);

taskPriorityControllers.controller('DateCtrl', [
    '$scope', '$routeParams', '$http', '$log', 'filterFilter', '$mdDialog', 'Task',
    function($scope, $routeParams, $http, $log, filterFilter, $mdDialog, Task) {
        var dialog;
        $scope.date = new Date($routeParams.date);
        $scope.tasks = [];
        $scope.tasksUI = [];
        $scope.tasksuI = [];
        $scope.tasksUi = [];
        $scope.tasksui = [];

        $scope.$watch('tasks', function(){
            $log.log('watch !');
            $scope.tasksUI = filterFilter($scope.tasks, {'urgent': true, 'important': true});
            $scope.tasksuI = filterFilter($scope.tasks, {'urgent': false, 'important': true});
            $scope.tasksUi = filterFilter($scope.tasks, {'urgent': true, 'important': false});
            $scope.tasksui = filterFilter($scope.tasks, {'urgent': false, 'important': false});
        }, true);

        // Récupération de la liste des tâches du jour
        Task.list({date: $scope.date}, function(data){
            angular.forEach(data, function(item){
                if (item._id) {
                    $scope.tasks.push(item);
                }
            });
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
                options.closeTo = 'body';
                options.openFrom = 'body';
                options.locals.currentTask = filterFilter($scope.tasks, {'_id': task})[0];
            } else {
                options.locals.currentTask = {};
            }
            dialog = $mdDialog.show(options).then(function(newTask){
                var existing_index = filterFilter($scope.tasks, {'_id': newTask._id})[0];
                if (newTask.date != moment($scope.date).toJSON()) {
                    $scope.tasks.splice(existing_index, 1);
                }
                if (existing_index === undefined) {
                    $scope.tasks.push(newTask);
                }
            }, function(error){
                $log.log('cancel');
            });
        };

        // Reporter les tâches non terminées
        $scope.postponeTask = function(e) {
            var unfinishedTasks = filterFilter($scope.tasks, {'done': false});
            var newDate = moment($scope.date);
            newDate.add(1, 'd');

            angular.forEach(unfinishedTasks, function(item){
                item.date = newDate.toDate();
                Task.update(item, function(data){
                    $scope.tasks.splice($scope.tasks.indexOf(item), 1);
                });
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
        if (currentTask._id != undefined) {
            $scope.task.date = new Date($scope.task.date);
        } else {
            $scope.task.date = date;
        }

        $scope.save = function() {
            if (undefined === $scope.task._id) {
                $scope.task.done = false;
                Task.create($scope.task, function(data){
                    $scope.task = data;
                    $mdDialog.hide($scope.task);
                });
            } else {
                Task.update($scope.task, function(data){
                    $mdDialog.hide(data);
                });
            }
        };
    }
]);