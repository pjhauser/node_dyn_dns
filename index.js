var express = require('express');
var fs = require("fs");

var app = express();
app.enable('trust proxy');

var domain = "home.pjhauser.com"


var config = function(ip){
	var confString = "server {\
		listen 80;\
		server_name " + domain + ";\
		location / {\
			proxy_pass http://"+ ip +"/;\
			proxy_http_version 1.1;\
			proxy_set_header Upgrade $http_upgrade;\
			proxy_set_header Connection 'upgrade';\
			proxy_set_header Host $host;\
			proxy_cache_bypass $http_upgrade;\
		}\
	}"
	return confString;
};

app.get('/:clientID', function(req, res) {
	var clientID = req.params.clientID;
	var ip = req.ip;

	if(clientID == "123"){
		var configFile = config(ip);
		var fileName = domain + ".conf";
		fs.writeFile(fileName, configFile, function(err) {
			if(err) {
				return console.log(err);
			}
		}); 
	}

	res.send(ip);
});

app.listen(3000);