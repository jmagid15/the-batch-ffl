const axios = require('axios');
const utils = require('./utils');

module.exports = (app) => {
  app.get('/api/:season/teams', async (req, res) => {
    res.send(await utils.getTeams(req.params.season));
  });
};
