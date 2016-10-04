# SL Deviations exporter

This simple web app is a [Prometheus](http://prometheus.io) exporter that returns deviation statistics for given lines. The inteded usage is to have alerts if deviations goes beyond a specific time span.

## API Key

You need an API key from [SL Realtidsinformation 3](https://www.trafiklab.se/api/sl-realtidsinformation-3). Add your key in apiKey.js

## Setup

You need to provide your desired lines and stations in config.json, see siteIdsAndLines object where the key is the siteId and the value is an array of the lines you want to track on that station. To find the siteId use [SL Platsuppslag](https://www.trafiklab.se/api/sl-platsuppslag)

## Running

```
docker build -t sl-deviations .
docker run -p 3000:3000 sl-deviations
```
