var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var redis = require('../redis-connect');

var valid_user = {
	"username" : "peterpan",
	"password" : "dreamisover"
};


function randomToken () {
    return crypto.randomBytes(24).toString('hex');
}

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
	console.log("Generating token");
	var token = randomToken();

	//save token in db
	redis.client.set("token:"+token, token, function(error, result) {
	    if (error) res.status(500).send('Error: ' + error);
	    else res.send(token);
	});
});


router.post('/logout', 
	function(req, res, next){
		if ( !req.get("Authorization") ){
			res.status(401).send();
			console.log("Authorization token not passed.")
		} else {
			redis.client.exists("token:"+req.get("Authorization"), function(error, result){
				if(result == 0) {
					res.status(401).send();
					console.log("Token doesn't exist.")
				} else {
					console.log("Token found.")
					next();
				}
			});
		}
	},
	function (req, res){
		var token = req.get("Authorization");
		console.log(token);

		redis.client.del("token:"+token, function(error, result){
			if(error) res.status(500).send('Error: ' + error);
			else res.status(200).send();		
	});

});

module.exports = router;