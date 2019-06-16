const axios = require('axios');
const http = require('http');
const url = require('url');

const getData = ({ cityFrom = 'HRK', cityTo = 'GDN', dateFrom = '2019-07-01', dateTo = '2019-08-01' }) => {
	const url = 'https://be.wizzair.com/9.12.0/Api/search/timetable';
	return axios.post(url, {
		'flightList': [
			{
				'departureStation': cityFrom,
				'arrivalStation': cityTo,
				'from': dateFrom,
				'to': dateTo
			},
			{
				'departureStation': cityTo,
				'arrivalStation': cityFrom,
				'from': dateFrom,
				'to': dateTo
			}
		],
		'adultCount': 1,
		'childCount': 0,
		'infantCount': 0,
		'priceType': 'regular'
	},
		{
			headers: {
				'Content-Type': 'application/json;charset=UTF-8',
				'Accept': 'application/json, text/plain, */*',
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
			}
		}
	);
}

http.createServer(function (req, res) {

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	var q = url.parse(req.url, true).query;
	getData(q).then(({ data }) => {
		res.write(JSON.stringify(data)); //write a response to the client
		res.end(); //end the response
	});
}).listen(3000); //the server object listens on port 8080
