const axios = require('axios');
const utils = require('./utils');

async function getTopScorers(wk, liveFlag) {
  console.log('top scorers');
  const teamMap = await utils.getTeams();
  try {
    const rsp = await axios.get(
      'http://fantasy.espn.com/apis/v3/games/ffl/seasons/2020/segments/0/leagues/319300?view=mMatchupScore'
    );
    const schedule = rsp.data.schedule;

    // Set week to current scoring period if 0
    if (wk == 0) {
      wk = rsp.data.scoringPeriodId;
    }

    var scores = {};
    for (i in schedule) {
      if (wk == schedule[i].matchupPeriodId) {
        console.log('woo ' + teamMap[schedule[i].away.teamId]);

        if (liveFlag) {
          scores[schedule[i].away.teamId] = {
            Team: teamMap[schedule[i].away.teamId],
            Points: schedule[i].away.totalPointsLive,
          };
          scores[schedule[i].home.teamId] = {
            Team: teamMap[schedule[i].home.teamId],
            Points: schedule[i].home.totalPointsLive,
          };
        } else {
          scores[schedule[i].away.teamId] = {
            Team: teamMap[schedule[i].away.teamId],
            Points: schedule[i].away.totalPoints,
          };
          scores[schedule[i].home.teamId] = {
            Team: teamMap[schedule[i].home.teamId],
            Points: schedule[i].home.totalPoints,
          };
        }
      }
    }

    // Sort the scores
    const sortedScoresArray = [];
    for (i in scores) {
      sortedScoresArray.push(scores[i]);
    }
    sortedScoresArray.sort(compare);
    scores = {};
    for (i in sortedScoresArray) {
      scores[i] = sortedScoresArray[i];
    }
    return scores;
  } catch (err) {
    console.error(err);
  }
}

function compare(a, b) {
  if (b['Points'] > a['Points']) return 1;
  if (a['Points'] > b['Points']) return -1;

  return 0;
}

module.exports = (app) => {
  app.get('/api/scores', async (req, res) => {
    res.send(200);
  });

  app.get('/api/topscorers', async (req, res) => {
    console.log('top scorers for current week');
    res.send(await getTopScorers(0, true));
  });

  app.get('/api/topscorers/:week', async (req, res) => {
    console.log('arrange top scorers for specific week');
    res.send(await getTopScorers(req.params.week, false));
  });

  app.get('/api/sheets/topscorers/:week', async (req, res) => {
    console.log('sheets topscorers');
    const scores = await getTopScorers(req.params.week, false);
    res.send(utils.convertToCSV(scores));
  });
};
