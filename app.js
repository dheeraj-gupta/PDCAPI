var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

var url; 

if(null == process.env.VCAP_SERVICES) {
	url = 'mongodb://localhost:27017/PDCAPI';
}
else {
	var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
	url = vcap_services['mongolab'][0].credentials.uri;
}

var db = mongoose.connect(url);
var Book = require('./models/bookModel');
var PDC = require('./models/pdcModel');

var app = express();

var port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

bookRouter = require('./Routers/bookRouters.js')(Book);

pdcRouter= require('./Routers/pdcRouters.js')(PDC);

app.use('/api/Books', bookRouter);
app.use('/api/PDCs', pdcRouter);

app.get('/', function (req, res) {
    
    res.send('welcome to get API');
});

app.listen(port, function () {
    console.log(' gulp application is running on Port:' + port);
});
