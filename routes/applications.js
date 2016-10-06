var express = require('express');
var router = express.Router();

var redis = require('../redis-connect');
var geofencing = require('../geofencing');

var valid_apps = [
	{
		"name" : "Open Office Writer",
		"id"	: "openoffice",
		"icon_url" : "http://somethingsomething.com",
		"description" : "User-friendly text processor for creating documents."
	},
	{
		"name" : "Inkscape",
		"id"	: "inkscape",
		"icon_url" : "http://somethingsomething.com",
		"description" : "Vector drawing made easy."
	},
	{
		"name" : "Tor Browser",
		"id"	: "tor",
		"icon_url" : "http://somethingsomething.com",
		"description" : "Browser the web without trace."
	},
	{
		"name" : "Tetris",
		"id"	: "tetris",
		"icon_url" : "http://somethingsomething.com",
		"description" : "Play the classic blocks game"
	}
	
];

var isInsideTBuilding = function(lat, lng){
	return geofencing.t_building.isInside(new geofencing.Point(lat, lng));
};

router.use(function checkToken(req, res, next){
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
});

router.get('/', function (req, res){
	var lat = req.query.lat;
	var lng = req.query.lng;
	var isInside = false;
	if(lat && lng){
		isInside = isInsideTBuilding(lat, lng);
	}

	if(isInside)
		console.log("User is inside T-building");

	sorted_apps = valid_apps.sort(function(a, b){
		var aId = a['id'];
		var bId = b['id'];
		var aName = a['name'];
		var bName = b['name'];

		// If user is inside T-building, handle openoffice as a special case
		if(isInside){
			if(aId == 'openoffice')
				return -1;
			else if(bId == 'openoffice')
				return 1;
		}

		// Sort rest by name
		return aName < bName ? -1 : (aName > bName ? 1 : 0);
	});

	res.send(sorted_apps);
});


router.route('/:appid')
.get(function(req, res){

	//TODO: store in redis that VM is running
	//TODO: plug in VM command

	var response = {
		"vm_url" : "https://somedummyurl.com"
	}
	res.status(200).send(response);
})
.delete(function(req, res){
	//TODO: check in redis if VM is running
	//TODO: plug in VM command

	res.status(202).send();
});

module.exports = router;