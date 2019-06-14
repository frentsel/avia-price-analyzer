fetch(`data/wroclaw.json`)
	.then((res) => res.json())
	.then((result) => {
		const data = result.reduce((acc, el) => {
			acc.outboundFlights.push(...el.outboundFlights);
			acc.returnFlights.push(...el.returnFlights);
			return acc;
		}, {
				outboundFlights: [],
				returnFlights: [],
			});

		console.log(JSON.stringify(data));
	});