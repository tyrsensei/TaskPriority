var mongoose = require('mongoose'),
    moment = require('moment');

moment.locale('fr');
mongoose.connect('mongodb://localhost/task_priority');

var taskSchema = mongoose.Schema({
    label: String,
    urgent: Boolean,
    important: Boolean,
    done: Boolean,
    time: Number,
    date: Date
});

var Task = mongoose.model('Task', taskSchema);

exports.calendar = function(req, res) {
    var premier_jour = moment().startOf('month').startOf('week').startOf('day');
    var dernier_jour = moment().endOf('month').endOf('week').endOf('day');

    Task.find({
        date: {$gte: premier_jour.toDate(), $lte: dernier_jour.toDate()}
    }, function(err, obj) {
        res.json(obj);
    });
};

exports.tasks = function(req, res) {

};

exports.newTask = function(req, res) {

};

exports.updateTask = function(req, res) {

};