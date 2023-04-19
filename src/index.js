import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const inputRef = document.querySelector('#search-box');
const listRef = document.querySelector('.country-list');
const infoRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const filter = e.target.value.trim();

  if (!filter) {
    clearMarkup();
    return;
  }

  fetchCountries(filter)
    .then((data) => {
      if (data.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        clearMarkup();
      } else if (data.length === 1) {
        clearMarkup();
        createCountryInfoMarkup(data);
      } else {
        clearMarkup();
        createCountryListMarkup(data);
      }
    })
    .catch(err => {
      Notify.failure('Oops, there is no country with that name')
      clearMarkup();
    })
}

function createCountryListMarkup(data) {
  const markupList = data.reduce((acc,country) =>  
    acc + `
    <li class='country-item'>
      <img class='img' src=${country.flags.svg} alt='${country.flags.alt}' width=28/>
      <span class='text'>${country.name.official}</span>
    </li>`,'');
  listRef.innerHTML = markupList;
}

function createCountryInfoMarkup(data) {
  const { name, capital, population, flags, languages } = data[0];
  const markupInfo = `
    <img class='img' src=${flags.svg} alt='${flags.alt}' width=50/>
    <span class='info-title'>${name.official}</span>
    <li class='info-list'>
      <span class='info-item'>Capital: </span>
      <span>${capital}</span>
    </li>
    <li class='info-list'>
      <span class='info-item'>Population: </span>
      <span>${population}</span>
    </li>
    <li class='info-list'>
      <span class='info-item'>Languages: </span>
      <span>${Object.values(languages).join(', ')}
    </span></li>`;
  infoRef.innerHTML = markupInfo;
}

function clearMarkup() {
  listRef.innerHTML = '';
  infoRef.innerHTML = '';
}