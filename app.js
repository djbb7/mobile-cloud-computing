var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json()); // for parsing application/json

var valid_user = {
	"username" : "peterpan",
	"password" : "dreamisover"
};

app.post('/login', function (req, res, next) {
	if(!req.body.username || !req.body.password
		|| req.body.username != valid_user.username
		|| req.body.password != valid_user.password){
		res.status(401).send();
	} else {
		return next();
	}
}, function (req, res){
	//generate token
	var token = '3434dd34434.12312esdsdsd'; 
	res.send(token);
});

app.post('/logout', function (req, res){
	res.send('Logout');
});

app.get('/application/list', function (req, res){});

app.route('/application/:appid')

.get(function(req, res){
	res.send('App: '+req.params.appid);
})

.delete(function(req, res){

});

var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
	console.log('Example app listening on port '+PORT);
    });