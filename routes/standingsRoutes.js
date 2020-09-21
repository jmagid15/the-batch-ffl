const axios = require('axios');
const utils = require('./utils');

module.exports = (app) => {
  app.get('/api/standings', async (req, res) => {
    res.send(await utils.getCurrentStandings());
  });
};
