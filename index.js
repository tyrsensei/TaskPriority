var express = require('express'),
    app = express(),
    swig = require('swig'),
    api = require('./api');

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname+'/views');

app.set('view cache', false);
swig.setDefaults({ cache: false, varControls: ['[[', ']]'] });

app.use('/assets', express.static(__dirname + '/bower_components/'));
app.use('/src', express.static(__dirname + '/src/'));
app.use('/views', express.static(__dirname + '/views/'));

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/api/tasks/', api.calendar);
app.get('/api/tasks/:date', api.tasks);
app.post('/api/tasks/:date', api.newTask);
app.put('/api/tasks/:date', api.updateTask);

var server = app.listen(3000, function(){
    var address = server.address();

    console.log('test sur %s:%s', address.address, address.port);
});