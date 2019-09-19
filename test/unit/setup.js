import Vue from 'vue';
import mockLocalStorage from './mocks/localstorage';

Vue.config.productionTip = false;

const fetch = require('node-fetch');

global.Headers = fetch.Headers;
global.fetch = require('jest-fetch-mock');

mockLocalStorage();
