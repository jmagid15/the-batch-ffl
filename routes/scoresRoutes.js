const axios = require('axios');
const utils = require('./utils');

module.exports = (app) => {
  app.get('/api/:season/topscorers', async (req, res) => {
    // Top Scorers for current week
    res.send(await utils.getTopScorers(req.params.season, 0));
  });

  app.get('/api/:season/topscorers/:week', async (req, res) => {
    // Top Scorers for specific week
    res.send(await utils.getTopScorers(req.params.season, req.params.week));
  });

  app.get('/api/:season/sheets/topscorers/:week', async (req, res) => {
    // Top Scorers for specific week in Google Sheets consumable csv format
    const scores = await utils.getTopScorers(req.params.season, req.params.week);
    res.send(utils.convertToCSV(scores));
  });

  app.get('/api/:season/currentweek', async (req, res) => {
    res.send(await utils.getCurrentWeek(req.params.season));
  })
};
