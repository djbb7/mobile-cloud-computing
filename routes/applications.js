var express = require('express');
var router = express.Router();

var redis = require('../redis-connect');
var geofencing = require('../geofencing');
var gcloud = require('../gcloud');


var valid_apps = [
	{
		"name" : "Open Office Writer",
		"id"	: "openoffice",
		"icon_url" : "%host%/static/openofficewriter.png",
		"description" : "User-friendly text processor for creating documents."
	},
	{
		"name" : "Inkscape",
		"id"	: "inkscape",
		"icon_url" : "%host%/static/inkscape.png",
		"description" : "Vector drawing made easy."
	},
	{
		"name" : "Tor Browser",
		"id"	: "tor",
		"icon_url" : "%host%/static/torbrowser.png",
		"description" : "Browser the web without trace."
	},
	{
		"name" : "Solitaire",
		"id"	: "solitaire",
		"icon_url" : "%host%/static/solitaire.png",
		"description" : "Play the classic lonely cards game."
	}
	
];

var isInsideTBuilding = function(lat, lng){
	return geofencing.t_building.isInside(new geofencing.Point(lat, lng));
};

var isValidApp = function(appid){
	var match = false;
	for (var i=0; i<valid_apps.length; i++){
		if(valid_apps[i].id == appid){
			match = true;
			break;
		}
	}
	return match;
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
	

	var sorted_apps = valid_apps;
	var baseUrl = req.protocol + '://' + req.get('host');
	res.send(sorted_apps.map(function(curr, i, arr){
		curr.icon_url = curr.icon_url.replace("%host%", baseUrl);
		return curr;
	}));
});



router.route('/:appid')
.all(function(req, res, next){
	if(isValidApp(req.params.appid)){
		next();
	} else {
		res.status(404).send();
	}
})
.get(function(req, res){
	gcloud.getInfo(req.params.appid, function(resp){
		if(resp.status == "TERMINATED"){
			//start machine
			gcloud.startApp(req.params.appid, function(gResp){
				if(gResp.status == "PENDING"){
					res.status(202).send();
				} else {
					res.status(500).send();
				}
			});
		} else if (resp.status == "STAGING" || resp.status == "PROVISIONING"){
			//virtual machine is not ready yet
			res.status(202).send();
		} else if (resp.status == "RUNNING"){
			//virtual machine is up and running :)
			var response = {
				"vm_url" : resp.ip_address + ":5901"
			}
			res.status(200).send(response);
		} else {
			//problem between us and google
			res.status(500).send();
		}
	});
})
.delete(function(req, res){
	gcloud.getInfo(req.params.appid, function(resp){
		if(resp.status == "TERMINATED"){
			res.status(404).send();
		} else if (resp.status == "STAGING" || resp.status == "RUNNING" || resp.status == "STOPPING"){
			gcloud.terminateApp(req.params.appid, function(gResp){
				console.log(gResp.status);
				res.status(202).send();
			})
		} else {
			//problem between us and google
			res.status(500).send();
		}
	});
});

module.exports = router;