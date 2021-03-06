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
    date: String
});

var Task = mongoose.model('Task', taskSchema);

exports.calendar = function(req, res) {
    var premier_jour = moment().month(req.query.month).startOf('month').startOf('week').startOf('day');
    var dernier_jour = moment().month(req.query.month).endOf('month').endOf('week').endOf('day');

    Task.find({
        date: {$gte: premier_jour.format('YYYY-MM-DD'), $lte: dernier_jour.format('YYYY-MM-DD')}
    }, function(err, obj) {
        res.json(obj);
    });
};

exports.tasks = function(req, res) {
    Task.find({date: req.params.date}, function(err, obj){
        res.json(obj);
    });
};

exports.newTask = function(req, res) {
    var task = new Task(req.body);
    task.save();
    res.json(task);
};

exports.updateTask = function(req, res) {
    var task = Task.findByIdAndUpdate(req.body._id, {
        label: req.body.label,
        urgent: req.body.urgent,
        important: req.body.important,
        done: req.body.done,
        time: req.body.time,
        date: req.body.date
    }, {}, function(err, data){
        res.json(req.body);
    });
};