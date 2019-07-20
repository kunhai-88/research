const axios = require('axios');

const get = endpoint => axios.get(`http://souke.xyz:9666${endpoint}`);

exports.get = get;