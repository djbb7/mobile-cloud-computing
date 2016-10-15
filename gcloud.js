
var gce = require('@google-cloud/compute')({
    projectId: 'mcc-2016-g15-p1',
    keyFilename: './config/mcc-2016-g15-p1-fe65b4974b6e.json'
});
var zone = gce.zone('europe-west1-c');
var application = require('./config/applicationList.json');

// run on an cloud instance
//var gce = require('@google-cloud/compute')();


// Call from app.js
/*
var gcloud = require('./gcloud');

 gcloud.getInfo('openoffice',function(){
 // Get repsonse here code and response
 });
* */


exports.startApp = function(appId, callback) {
    var vm = zone.vm(application[appId]);
    vm.start(function(err, operation, apiResponse) {
        if (err) {
            res = {
                "code" : 500, //can be changed
                "status" : err
            }
        } else {
            res = {
                "code" : 200,
                "status" : apiResponse.status
            }
        }
        callback(res);
    });
};

// Get Information = (state of machine and IP)
/*
* State of machine
* STAGING
* PROVISIONING
* RUNNING
* TERMINATED
* STOPPING
* STAGING and RUNNING stage including IP address. TERMINATED - NO IP Address
* */
exports.getInfo = function(appId, callback) {
    var vm = zone.vm(application[appId]);
    vm.get (function(err, apiResponse){
        if (err){
            r = {
                'status' : err
            }
        } else {
            // get status of machine
            var status = apiResponse.metadata.status;
            if (status == 'TERMINATED'){
                r = {
                    'code' : 0, 
                    'status': status,
                    'ip_address' : null
                }
            } else if (status == 'PROVISIONING') {
                r = {
                    'code' : 2, 
                    'status': status,
                    'ip_address' : null
                }
            } else{
                var detailObj = JSON.stringify(apiResponse);
                var externalIPJsonObj = detailObj.match('\"natIP\":\"[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\"');
                var externalIP = JSON.parse('{'+externalIPJsonObj+'}').natIP;
                r = {
                    'code' : 1,
                    'status': status,
                    'ip_address' : externalIP
                }
            }
        }
        callback(r);
    });
};

exports.terminateApp = function(appId, callback) {
    var vm = zone.vm(application[appId]);
    vm.stop(function(err, operation, apiResponse) {
        if (err) {
            r = {
                "code" : 500, //can be changed
                "status" : err
            }
        } else {
            r = {
                "code" : 200,
                "status" : apiResponse.status
            }
        }
        callback(r);
    });
};