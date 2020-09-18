const axios = require('axios');
const utils = require('./utils');

module.exports = (app) => {
  app.get('/api/standings', async (req, res) => {
    console.log('Getting current standings');
    res.send(await utils.getCurrentStandings());
  });
};
