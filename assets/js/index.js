const apiURL = "https://mindicador.cl/api/";
const currenciesArray = []

// TODO: asegurar de agarrar excepciones
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
		
		const { version, autor, fecha, ...monedas } = currencies;
	
		Object.values(monedas).forEach(moneda => {
			currenciesArray.push(moneda)
		});
	} catch (e) {
		alert(e.message)
	}
}

async function getHistoricalData(currency){
	apiHistoryURL = `${apiURL}${currency}`
	try{
		const res = await fetch(apiHistoryURL);
		const history = await res.json();
		return history
	} catch (e) {
		alert(e.message)
	}
}

async function storeHistory(currency){
	try{
		const history = await getHistoricalData(currency);
		const serie = history.serie
		return serie
	} catch (e) {
		alert(e.message)
	}
}

function createChartData(serie){
	template = `<h1>Grafico</h1>
	<div id="grafico">
		<canvas id="myChart"></canvas>
	</div>`

	chart.innerHTML = template

	const labels = serie.map(obs => {
		return obs.fecha
	});

	const data = serie.map(obs => {
		return obs.valor
	});

	console.log(labels)
	console.log(data)

	const datasets = [
		{
			label: "Valor",
			borderColor: "rgb(255, 99, 132)",
			data
		}
	]

	return { labels, datasets }
}

function renderChart(serie) {
	const data = createChartData(serie);
	const config =  {
		type: "line",
		data
	};

	const myChart = document.getElementById("myChart");
	myChart.style.backgroundColor = "white";
	new Chart(myChart, config);
}

storeCurrencies()

const input = document.querySelector('input')
const selectCurrency = document.getElementById('currencyDropdown')
const btn = document.querySelector('button')
const result = document.getElementById('result')
const chart = document.getElementById('chart-container')

// TODO: revisar formato del input, que sea un int
btn.addEventListener('click', async () => {
	amount = input.value;
	currency = selectCurrency.value;
	currencyValue = currenciesArray.find(c => c.codigo === currency).valor;
	result.innerHTML = `Resultado: ${(amount / currencyValue).toFixed(2)}`;

	const serie = await storeHistory(currency);
	renderChart(serie)
}
)