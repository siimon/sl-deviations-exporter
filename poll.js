'use strict';

const settings = require('./config');
const Gauge = require('prom-client').Gauge;
const request = require('request');
const timeWindow = settings.timeWindow || 30;
const apiKey = require('./apiKey')();

const deviationGauge = new Gauge('sl_max_deviation_sec', `Max deviation within ${timeWindow} minutes`, ['destination', 'line']);

module.exports = () => {
	poll();
};

const poll = () => {
	console.log('Polling for new deviations');
	Object.keys(settings.siteIdsAndLines).forEach((siteId) => {
		const lines = settings.siteIdsAndLines[siteId];
		const url = `https://api.sl.se/api2/realtimedepartures.json?key=${apiKey}&siteid=${siteId}&timewindow=${timeWindow}`

		const parseResponse = (err, res, body) => {
			try{
				const responseData = JSON.parse(body).ResponseData;

				const allDepartures = responseData.Buses.concat(responseData.Trains).concat(responseData.Trams).concat(responseData.Ships);
				const deviations = allDepartures.map(createDeviation).reduce(getDeviation, {});
				setMetrics(deviations);
			} catch(e) {
			}

			setTimeout(poll, 60000);
		};

		const getDeviation = (acc, departure) => {
			if(!acc[departure.lineNumber]) {
				acc[departure.lineNumber] = departure;
			}

			acc[departure.lineNumber].deviation = Math.max(departure.deviation, acc[departure.lineNumber].deviation);
			return acc;
		};

		const createDeviation = (departure) => { 
			return {
					deviation: calculateDeviation(departure),
					destination: departure.Destination,
					lineNumber: departure.LineNumber
				};
		};

		const calculateDeviation = (departure) => (new Date(departure.ExpectedDateTime) - new Date(departure.TimeTabledDateTime)) / 1000;

		const setMetrics = result => {
			Object.keys(result).forEach(line => {
				deviationGauge.set({ destination: result[line].destination, line: line }, result[line].deviation);
			});	
		}

		request(url, parseResponse);
	});
};

