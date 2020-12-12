const axios = require('axios');
const utils = require('./utils');

module.exports = (app) => {
  app.get('/api/topscorers', async (req, res) => {
    // Top Scorers for current week
    res.send(await utils.getTopScorers(0));
  });

  app.get('/api/topscorers/:week', async (req, res) => {
    // Top Scorers for specific week
    res.send(await utils.getTopScorers(req.params.week));
  });

  app.get('/api/sheets/topscorers/:week', async (req, res) => {
    // Top Scorers for specific week in Goole Sheets consumable csv format
    const scores = await utils.getTopScorers(req.params.week);
    res.send(utils.convertToCSV(scores));
  });

  app.get('/api/currentweek', async (req, res) => {
    res.send(await utils.getCurrentWeek());
  })
};
