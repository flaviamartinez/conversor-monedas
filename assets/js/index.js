const apiURL = "https://mindicador.cl/api/";
const currenciesArray = [];

async function getCurrencies() {
  try {
    const res = await fetch(apiURL);
    const currencies = await res.json();
    return currencies;
  } catch (e) {
    alert(e.message);
  }
}

async function storeCurrencies() {
  try {
    const currencies = await getCurrencies();

    const { version, autor, fecha, ...monedas } = currencies;

    Object.values(monedas).forEach((moneda) => {
      currenciesArray.push(moneda);
    });
  } catch (e) {
    alert(e.message);
  }
}

async function getHistoricalData(currency) {
  const apiHistoryURL = `${apiURL}${currency}`;

  try {
    const res = await fetch(apiHistoryURL);
    const history = await res.json();
    return history;
  } catch (e) {
    alert(e.message);
  }
}

async function storeHistory(currency) {
  try {
    const history = await getHistoricalData(currency);
    const serie = history.serie;
    return serie;
  } catch (e) {
    alert(e.message);
  }
}

function createChartData(serie) {
  const template = `
	<h2>Grafico de Evolución</h2>
	<div id="grafico">
		<canvas id="myChart" width="800" height="400"></canvas>
	</div>
	`;

  const filteredSerie = serie.slice(0, 10);

  filteredSerie.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  chart.innerHTML = template;

  const labels = filteredSerie.map((obs) => {
    return obs.fecha.split("T")[0];
  });

  const data = filteredSerie.map((obs) => {
    return obs.valor;
  });

  const datasets = [
    {
      label: "Tipo de cambio",
      borderColor: "rgb(255, 99, 132)",
      data,
    },
  ];

  return { labels, datasets };
}

function renderChart(serie) {
  const data = createChartData(serie);
  const config = {
    type: "line",
    data,
    options: {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
      },
    },
  };

  const myChart = document.getElementById("myChart");
  myChart.style.backgroundColor = "white";
  new Chart(myChart, config);
}

const input = document.querySelector("input");
const selectCurrency = document.getElementById("currencyDropdown");
const btn = document.querySelector("button");
const result = document.getElementById("result");
const chart = document.getElementById("chart-container");

storeCurrencies();

btn.addEventListener("click", async () => {
  const amount = input.value;
  const currency = selectCurrency.value;
  const selectedCurrency = currenciesArray.find((c) => c.codigo === currency);

  if (amount === "") {
    alert("Debes ingresar monto en CLP");
    return;
  }

  if (amount <= 0) {
    alert("Debes ingresar un valor mayor a 0");
    return;
  }

  if (!selectedCurrency) {
    alert("Debes seleccionar una moneda");
    return;
  }

  const currencyValue = selectedCurrency.valor;

  result.innerHTML = `Resultado: ${(amount / currencyValue).toFixed(2)}`;

  const serie = await storeHistory(currency);
  renderChart(serie);
});
