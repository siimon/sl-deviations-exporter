'use strict';

module.exports = () => {
	const key = '';
	if(!key) {
		throw new Error('Missing required API key, key from SLRealtidsinformation (https://www.trafiklab.se/api/sl-realtidsinformation-3)');
	}

	return key;
};
