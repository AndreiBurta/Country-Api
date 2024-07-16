'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const html = `
 <article class="country ${className}">
      <img class="country__img" src="${data.flags.png}" />
      <div class="country__data">
          <h3 class="country__name">${data.name}</h3>
          <h4 class="country__region">${data.region}</h4>
          <p class="country__row"><span>👫</span>${(
            +data.population / 1000000
          ).toFixed(1)}</p>
          <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
          <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
      </div>
    </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderError = function (message) {
  countriesContainer.insertAdjacentText('beforeend', message);
  countriesContainer.style.opacity = 1;
};

const getJSON = function (url, errorMsg = 'Something went wrong!') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function () {
  try {
    btn.disabled = true;
    //GeoLocation
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;
    // Reverse geocoding
    const resGeo = await fetch(
      `https://geocode.xyz/${lat},${lng}?geoit=json&auth=785139530065272552108x36609`
    );
    if (!resGeo.ok) throw new Error('Problem getting location data');
    const dataGeo = await resGeo.json();
    //Country data
    const res = await fetch(
      `https://countries-api-836d.onrender.com/countries/name/${dataGeo.country}`
    );
    if (!res.ok) throw new Error('Problem getting country');
    const data = await res.json();
    renderCountry(data[0]);

    return `You are in ${dataGeo.city}, ${dataGeo.country}`;
  } catch (err) {
    renderError(`${err.message}`);

    throw err;
  } finally {
    // Reactivează butonul indiferent de succes sau eroare
    btn.disabled = false;
  }
};
btn.addEventListener('click', whereAmI);
