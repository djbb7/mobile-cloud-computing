var express = require('express');
var router = express.Router();


var redis   = require("redis");

if (process.env.REDIS_PORT && process.env.REDIS_HOST && process.env.REDIS_PASSWORD) {
	var client  = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
	client.auth(process.env.REDIS_PASSWORD);
} else {
	client = redis.createClient();
}

client.on('connect', function() {
    console.log('Connected to redis instance');
});

var valid_user = {
	"username" : "peterpan",
	"password" : "dreamisover"
};

//TODO: check if user is already logged in
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

	//save token in db
	client.set("token:"+token, token, function(error, result) {
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
			client.exists("token:"+req.get("Authorization"), function(error, result){
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

		client.del("token:"+token, function(error, result){
			if(error) res.status(500).send('Error: ' + error);
			else res.status(200).send();		
	});

});

module.exports = router;