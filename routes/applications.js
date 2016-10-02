var express = require('express');
var router = express.Router();

var valid_apps = [{
	"name" : "Open Office Writer",
	"id"	: "openoffice",
	"icon_url" : "http://somethingsomething.com"
}];

var isInsideOtakari = function(lat, lng){
	return true;
};

router.get('/', function (req, res){
	var lat = req.query.lat;
	var lng = req.query.lng;
	var isInside = false;
	if(lat && lng){
		isInside = isInsideOtakari(lat, lng);
	} 

	//TODO: order app list

	res.send(valid_apps);
});


router.route('/application/:appid')
.get(function(req, res){
	res.send('App: '+req.params.appid);
})
.delete(function(req, res){

});

module.exports = router;