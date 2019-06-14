
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
		from,
		to,
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

const renderDataGrid = (data) => {
	const fDirection = `${data[0].from.departureStation} ✈ ${data[0].from.arrivalStation}`;
	const tDirection = `${data[0].to.departureStation} ✈ ${data[0].to.arrivalStation}`;
	const currency = data[0].from.price.currencyCode;
	$('#jsGrid').jsGrid({
		width: '100%',
		height: '400px',
		sorting: true,
		paging: true,
		data,
		fields: [
			{ name: 'sum', title: `Total sum (${currency})`, type: 'number', width: 50, sorting: true },
			{ name: 'from.price.amount', title: `${fDirection}, Price (${currency})`, type: 'text', width: 50, sorting: true },
			{ name: 'to.price.amount', title: `${tDirection}, Price (${currency})`, type: 'text', width: 50, sorting: true },
			{ name: 'from.departureDate', title: 'Departure time', type: 'text', width: 100, sorting: true, sorter: 'date', itemTemplate: tpl.date },
			{ name: 'to.departureDate', title: 'Arrival time', type: 'text', width: 100, sorting: true, sorter: 'date', itemTemplate: tpl.date },
			{ name: 'days', title: 'Total days', type: 'number', width: 50, sorting: true }
		]
	});
}

const analize = (city = 'gdansk') => {
	fetch(`data/${city}.json`)
		.then((res) => res.json())
		.then(({ outboundFlights: from, returnFlights: to }) => {
			const result = foo(from, to);
			const data = result.sort((a, b) => a.sum - b.sum);
			renderDataGrid(data);
		});
}

analize('gdansk');