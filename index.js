const request = require('request');
const http = require('http');
const url = require('url');

const getData = ({ cityFrom = 'HRK', cityTo = 'GDN', dateFrom = '2019-07-01', dateTo = '2019-08-01' }, callback) => {
    const url = 'https://be.wizzair.com/9.12.0/Api/search/timetable';
    return request.post({
        url,
        method: 'POST',
        json: true,
        body: {
            "flightList": [
                {
                    "departureStation": cityFrom,
                    "arrivalStation": cityTo,
                    "from": dateFrom,
                    "to": dateTo
                },
                {
                    "departureStation": cityTo,
                    "arrivalStation": cityFrom,
                    "from": dateFrom,
                    "to": dateTo
                }
            ],
            "adultCount": 1,
            "childCount": 0,
            "infantCount": 0,
            "priceType": 'regular'
        }
    }, callback);
}

http.createServer(function (req, res) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    var q = url.parse(req.url, true).query;
    getData(q, function (error, response, body) {
        res.write(JSON.stringify(body)); //write a response to the client
        res.end(); //end the response
    });
}).listen(3000); //the server object listens on port 8080
