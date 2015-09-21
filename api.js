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
    Task.find({date: req.params.date}, function(err, obj){
        res.json(obj);
    });
};

exports.newTask = function(req, res) {
    var task = new Task(req.body);
    task.save();
    res.json(req.body);
};

exports.updateTask = function(req, res) {
    console.log(req.body);
    var task = Task.findByIdAndUpdate(req.body._id, {
        label: req.body.label,
        urgent: req.body.urgent,
        important: req.body.important,
        done: req.body.done,
        time: req.body.time,
        date: req.body.date
    }, {}, function(){
        res.json(req.body);
    });
};