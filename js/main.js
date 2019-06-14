
const getDate = ({ departureDate }) => new Date(departureDate).getTime();
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

	const { currencyCode: cur } = _from.price;
	const { amount: fPrice } = _from.price;
	const { amount: tPrice } = _to.price;
	let { departureDate: fDate } = _from;
	let { departureDate: tDate } = _to;
	fDate = new Date(fDate).toString().split(' ').slice(0, 4).reverse().join('/');
	tDate = new Date(tDate).toString().split(' ').slice(0, 4).reverse().join('/');
	res.push({
		sum: fPrice + tPrice,
		price: `${fPrice} + ${tPrice}`,
		form: fDate,
		to: tDate,
		days: dateDiff(_from, _to)
	});
	return foo(f, t, res);
};

const analize = (city = 'gdansk') => {
	fetch(`data/${city}.json`)
		.then((res) => res.json())
		.then(({ outboundFlights: from, returnFlights: to }) => {
			const result = foo(from, to);
			console.log(result.sort((a, b) => a.sum - b.sum));
		});
}
