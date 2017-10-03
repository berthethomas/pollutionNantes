var http = require('http'),
	dateFormat = require('dateformat');

//Attributes
function Pollution(obj, callback) {
	var now = new Date();

	this.host    = 'www2.prevair.org';
	this.path    = '/ineris-web-services.php';
	this.date = dateFormat(now, "yyyymmdd");
	this.pm10      = null;
	this.indice   = null;

	this.init(obj, callback);
};
//Non-statics methods
Pollution.prototype = {
	init: function(obj, callback)
	{
		for (var fld in obj) {
			if (obj.hasOwnProperty(fld)) {
				this[fld] = obj[fld];
			}
		}

			this.getInfos(callback);
	},
	getInfos: function(callback)
	{
		var object = this,
			response = '';

		var req = http.request({
			host  : object.host,
			port  : 80,
			path  : object.path+'?url=atmo&date='+object.date,
			method: 'GET',
		}, function(res) {
			console.log(`STATUS: ${res.statusCode}`);
			console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

			res.setEncoding('utf8');

			res.on('data', (chunk) => {
				response = response + chunk;
			});

			res.on('end', () => {
				datas = JSON.parse(response);

				datas.forEach(function(element) {
					if(element[4] === "NANTES") {
						console.log(element);
						object.indice = element[7];
						object.pm10 = element[11];
					}
				});

				callback(object);
			});
		});

		req.on('error', (e) => {
			console.log(`problem with request: ${e.message}`);
		});

		req.end();
	},
};
//Statics methods
Pollution.getPollution = function(callback)
{
	var pollution = new Pollution(null, callback);
};

module.exports = Pollution;
