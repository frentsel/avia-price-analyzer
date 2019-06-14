
const getDate = ({ departureDate }) => new Date(departureDate).getTime();
const getDay = ({ departureDate }) => {
	const date = new Date(departureDate).getDay();
	return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date];
}
const dateDiff = (from, to) => {
	return Math.round((getDate(to) - getDate(from)) / (1000 * 60 * 60 * 24));
}
const foo = (f, t, res = [], limit = 3) => {

	if (!f.length) return res;

	const _from = f.shift();
	const _to = t
		.filter(el => getDate(el) > getDate(_from))
		.slice(0, limit)
		.sort((a, b) => a.price.amount - b.price.amount)
		.shift();

	if (!_to) return res;

	const { amount: fPrice } = _from.price;
	const { amount: tPrice } = _to.price;
	let { departureDate: fDate } = _from;
	let { departureDate: tDate } = _to;
	fDate = tDate.replace(/2019-|T00:00:00/g, '');
	tDate = tDate.replace(/2019-|T00:00:00/g, '');
	res.push({
		sum: fPrice + tPrice,
		form: `${fDate}/${getDay(_from)}/${fPrice}`,
		to: `${tDate}/${getDay(_to)}/${tPrice}`,
		days: dateDiff(_from, _to)
	});
	return foo(f, t, res);
};

const analize = () => {
	fetch('data/items.json')
		.then((res) => res.json())
		.then(({ outboundFlights: from, returnFlights: to }) => {
			const result = foo(from, to);
			console.log(result.sort((a, b) => a.sum - b.sum));
		});
}
