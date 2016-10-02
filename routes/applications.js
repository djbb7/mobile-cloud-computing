var express = require('express');
var router = express.Router();

var valid_apps = [{
	"name" : "Open Office Writer",
	"id"	: "openoffice",
	"icon_url" : "http://somethingsomething.com"
}];

router.get('/application/list', function (req, res){});


router.route('/application/:appid')
.get(function(req, res){
	res.send('App: '+req.params.appid);
})
.delete(function(req, res){

});

module.exports = router;