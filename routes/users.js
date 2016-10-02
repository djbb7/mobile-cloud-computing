var express = require('express');
var router = express.Router();

var valid_user = {
	"username" : "peterpan",
	"password" : "dreamisover"
};

router.post('/login', function (req, res, next) {
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


router.post('/logout', function (req, res){
	res.send('Logout');
});

module.exports = router;