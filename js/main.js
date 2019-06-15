const getDate = ({ departureDate }) => new Date(departureDate).getTime();
const dateDiff = (from, to) => {
	return Math.round((getDate(to) - getDate(from)) / (1000 * 60 * 60 * 24));
}
const foo = (f, t, res = [], limit = 3) => {

	if (!f.length) return res;

	const from = f.shift();
	const to = t
		.filter(el => getDate(el) > getDate(from))
		.slice(0, limit)
		.sort((a, b) => a.price.amount - b.price.amount)
		.shift();

	if (!to) return res;

	res.push({
		from, to,
		dPrice: from.price.amount,
		aPrice: to.price.amount,
		dTime: getDate(from),
		aTime: getDate(to),
		sum: from.price.amount + to.price.amount,
		days: dateDiff(from, to)
	});
	return foo(f, t, res);
};

const tpl = {
	date: (date) => {
		const [wDay, month, day, year] = new Date(date).toString().split(' ');
		return `${day} ${month} ${year}, ${wDay}`;
	}
};
const filterData = function (data) {
	return (filterItem) => {
		let res = [...data];
		for (const key in filterItem) {
			if (!filterItem[key]) continue;
			if (/^(d|a)Time$/.test(key)) {
				res = res.filter(el => {
					return tpl.date(el[key]).toLowerCase().indexOf(filterItem[key].toLowerCase()) > -1;
				});
				continue;
			}
			res = res.filter(el => {
				return el[key].toString().indexOf(filterItem[key]) > -1;
			});
		}
		return res;
	}
}

const renderDataGrid = (data) => {
	const dDirection = `${data[0].from.departureStation} ✈ ${data[0].from.arrivalStation}`;
	const aDirection = `${data[0].to.departureStation} ✈ ${data[0].to.arrivalStation}`;
	const currency = data[0].from.price.currencyCode;

	$('#jsGrid').jsGrid({
		width: '100%',
		height: '400px',
		sorting: true,
		filtering: true,
		paging: true,
		pageSize: 30,
		controller: { loadData: filterData(data) },
		data,
		fields: [
			{ name: 'sum', title: `Total sum (${currency})`, type: 'number', width: 50, sorting: true },
			{ name: 'dPrice', title: `${dDirection}, Price (${currency})`, type: 'number', width: 50, sorting: true },
			{ name: 'aPrice', title: `${aDirection}, Price (${currency})`, type: 'number', width: 50, sorting: true },
			{ name: 'dTime', title: 'Departure time', type: 'text', width: 100, sorting: true, itemTemplate: tpl.date },
			{ name: 'aTime', title: 'Arrival time', type: 'text', width: 100, sorting: true, itemTemplate: tpl.date },
			{ name: 'days', title: 'Total days', type: 'number', width: 50, sorting: true },
		]
	});
}

const analize = (city = 'gdansk') => {
	fetch(`data/${city}.json?t=${new Date().toString()}`)
		.then((res) => res.json())
		.then(({ outboundFlights: from, returnFlights: to }) => {
			const result = foo(from, to);
			const data = result.sort((a, b) => a.sum - b.sum);
			renderDataGrid(data);
		});
}

window.onhashchange = function () {
	var city = location.hash.slice(1);
	analize(city);
};

location.hash = '';
location.hash = '#gdansk';

const fill = (city = 'WRO') => {
	const from = [
		'2019-07-01',
		'2019-08-01',
		'2019-09-01',
		'2019-10-01',
		'2019-11-01',
		'2019-12-01',
		'2020-01-01',
		'2020-02-01',
		'2020-03-01',
		'2020-04-01',
		'2020-05-01',
	];
	const to = [
		'2019-08-01',
		'2019-09-01',
		'2019-10-01',
		'2019-11-01',
		'2019-12-01',
		'2020-01-01',
		'2020-02-01',
		'2020-03-01',
		'2020-04-01',
		'2020-05-01',
		'2020-06-01',
	];
	data = {
		outboundFlights: [],
		returnFlights: []
	};

	const xxx = (_from, _to, _data, finish) => {

		if (!_from.length || !_to.length) return finish(_data);

		const dateFrom = _from.shift();
		const dateTo = _to.shift();
		fetch(`http://127.0.0.1:3000/?cityTo=${city}&dateFrom=${dateFrom}&dateTo=${dateTo}`)
			.then(response => response.json())
			.then(({ outboundFlights, returnFlights }) => {
				_data.outboundFlights.push(...outboundFlights);
				_data.returnFlights.push(...returnFlights);

				xxx(_from, _to, _data, finish);
			});
	}

	xxx(from, to, data, function (result) {
		console.log(JSON.stringify(result));
	});
}