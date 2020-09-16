const axios = require('axios');

module.exports = (app) => {
  app.get('/api/teams/:teamID', async (req, res) => {
    console.log('hitting teams endpoint');
    try {
      const rsp = await axios.get(
        'http://fantasy.espn.com/apis/v3/games/ffl/seasons/2020/segments/0/leagues/319300?view=mTeam'
      );
      res.send(rsp.data.teams[req.params.teamID - 1]);
    } catch (err) {
      console.error(err);
    }
  });
};
