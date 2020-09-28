// estado da aplicação - inicio
let tabCountries = null;
let tabFavorites = null;

let allCountries = [];
let favoriteCountries = [];

let countCountries = 0;
let countFavorites = 0;

let totalPopulationList = 0;
let totalPopulationFavorites = 0;

let numberFormat = null;
// estado da aplicação - fim

window.addEventListener('load', () => {
  tabCountries = document.querySelector('#tabCountries');
  tabFavorites = document.querySelector('#tabFavorites');

  countCountries = document.querySelector('#countCountries');
  countFavorites = document.querySelector('#countFavorites');

  totalPopulationList = document.querySelector('#totalPopulationList');
  totalPopulationFavorites = document.querySelector('#totalPopulationFavorites'); // talvez

  numberFormat = Intl.NumberFormat('pt-BR');

  fetchCountries();
})

async function fetchCountries(){
  const res = await fetch('https://restcountries.eu/rest/v2/all');
  const json = await res.json();

  allCountries = json.map(country => {

    const{ numericCode, translations, population, flag } = country;

    return {
      id: numericCode,
      name: translations.pt,
      /* population: population, */ // como tem repetido pode-se eliminar o population
      population,
      formattedPopulation: formatNumber(population),
      flag,
    };
  });

  render();
};

function render(){
  renderCountryList();
  renderFavorites();
  renderSummary();

  handleCountryButtons();
}

function renderCountryList(){
  let countriesHTML = "<div>";

  allCountries.forEach(country => {
    const { name, flag, id, population, formattedPopulation } = country;

    const countryHTML = `
      <div class='country'>
        <div>
          <a id="${id}" class="waves-effect waves-circle waves-light btn btn-floating button-green"> + </a>
        </div>
        <div>
          <img src="${flag}" alt="${name}" class="flag">
        </div>
        <div>
          <ul>
            <li>${name}</li>
            <li>${formattedPopulation}</li>
          </ul>
        </div>
      </div>
    `;
    countriesHTML += countryHTML;
  });
  countriesHTML += '</div>';

  tabCountries.innerHTML = countriesHTML;
}

function renderFavorites(){
  let favoritesHTML = '<div>';

  favoriteCountries.forEach(country => {
    const { name, flag, id, population, formattedPopulation } = country;

    const favoriteCountryHTML =`
      <div class='country'>
        <div>
          <a id="${id}" class="waves-effect waves-circle waves-light btn btn-floating button-red"> - </a>
        </div>
        <div>
          <img src="${flag}" alt="${name}" class="flag">
        </div>
        <div>
          <ul>
            <li>${name}</li>
            <li>${formattedPopulation}</li>
          </ul>
        </div>
      </div>
    `;

    favoritesHTML += favoriteCountryHTML;
  });
  favoritesHTML += '</div>';

  tabFavorites.innerHTML = favoritesHTML;
};

function renderSummary(){
  countCountries.textContent = allCountries.length;
  countFavorites.textContent = favoriteCountries.length;

  const totalPopulation = allCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);

  const totalFavorites = favoriteCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);
  
  totalPopulationList.textContent = formatNumber(totalPopulation);
  totalPopulationFavorites.textContent = formatNumber(totalFavorites);
};

function handleCountryButtons(){
  const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));
  const favoriteButtons = Array.from(tabFavorites.querySelectorAll('.btn'));

  countryButtons.forEach(button => {
    button.addEventListener('click', () => addToFavorites(button.id));
  });

  favoriteButtons.forEach(button => {
    button.addEventListener('click', () => removeFromFavorites(button.id));
  });
}

function addToFavorites(id) {
  const countryToAdd = allCountries.find(country => country.id === id); // array.find tras o elemento
  favoriteCountries = [...favoriteCountries, countryToAdd];
  
  favoriteCountries.sort((a,b) => {
    return a.name.localeCompare(b.name);
  });

  allCountries = allCountries.filter(country => country.id !== id);
  render();
}

function removeFromFavorites(id) {
  const countryToRemove = favoriteCountries.find(country => country.id === id); // array.find tras o elemento
  allCountries = [...allCountries, countryToRemove];

  allCountries.sort((a,b) => {
    return a.name.localeCompare(b.name);
  });
  
  favoriteCountries = favoriteCountries.filter(country => country.id !== id);
  render();
}

function formatNumber(number) {
  return numberFormat.format(number);
}
