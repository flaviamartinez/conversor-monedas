const apiURL = "https://mindicador.cl/api/";
const currenciesArray = []

async function getCurrencies() {
	try {
		const res = await fetch(apiURL);
		const currencies = await res.json();
		return currencies
	} catch (e) {
		alert(e.message)
	}
}

async function storeCurrencies() {
	try {
		const currencies = await getCurrencies();
		
		const { version, autor, fecha, ...monedas} = currencies;
	
		Object.values(monedas).forEach(moneda => {
			currenciesArray.push(moneda)
		});
	
		console.log(currenciesArray)
	} catch (e) {
		alert(e.message)
	}
}

storeCurrencies()