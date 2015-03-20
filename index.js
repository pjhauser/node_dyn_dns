var express = require('express');
var _ = require('underscore');
var fs = require("fs");
var exec = require("child_process");

var app = express();
app.enable('trust proxy');

var domain = "home.pjhauser.com"
var domainTemplate = "home.domain.com.conf.tpl"

app.get('/:clientID', function(req, res) {
	var clientID = req.params.clientID;
	var ip = req.ip;

	if(clientID == "123"){


		fs.readFile(domainTemplate, "utf8",function(err, data){
			if(err){
				return console.log(err);
			}

			var tpl = _.template(data);
			var configFile = tpl({ip: ip, domain: domain});

			var fileName = domain + ".conf";
			fs.writeFile(fileName, configFile, function(err) {
				if(err) {
					return console.log(err);
				}
			}); 

			exec("sudo service nginx reload");

		});

	}

	res.send(ip);
});

app.listen(3000);