const axios = require('axios');
const utils = require('./utils');

function getTeamProjTotal(entry) {
  var teamProjTotal = 0;
  // lineupSlotId of Bench is 20, and IR is 21
  if (entry.lineupSlotId != 20 && entry.lineupSlotId != 21) {
    if (entry.playerPoolEntry.player.stats.length > 1) {
      // multiple entries indicate the player has played
      for (st of entry.playerPoolEntry.player.stats) {
        if (st.statSourceId == 0) {
          // statSourceId = 0 for real score, 1 for projections
          teamProjTotal += st.appliedTotal;
        }
      }
    } else {
      teamProjTotal += entry.playerPoolEntry.player.stats[0].appliedTotal;
    }
  }

  return teamProjTotal;
}

async function getWeeklyProjections() {
  const teamMap = await utils.getTeams();
  try {
    var rsp = await axios.get(
      'http://fantasy.espn.com/apis/v3/games/ffl/seasons/2020/segments/0/leagues/319300?view=mMatchupScore'
    );
    const currentWeek = rsp.data.scoringPeriodId;
    var rsp = await axios.get(
      'http://fantasy.espn.com/apis/v3/games/ffl/seasons/2020/segments/0/leagues/319300?view=mLiveScoring&view=mMatchupScore'
    );
    const currentMatchups = rsp.data.schedule.slice(
      currentWeek * 5 - 5,
      currentWeek * 5
    );

    const teamProjections = [];

    for (i in currentMatchups) {
      var awayProjTotal = 0;
      var homeProjTotal = 0;
      for (entry of currentMatchups[i].away.rosterForCurrentScoringPeriod
        .entries) {
        awayProjTotal += getTeamProjTotal(entry);
      }
      for (entry of currentMatchups[i].home.rosterForCurrentScoringPeriod
        .entries) {
        homeProjTotal += getTeamProjTotal(entry);
      }

      teamProjections.push({
        id: currentMatchups[i].away.teamId,
        name: teamMap[currentMatchups[i].away.teamId].name,
        projectedTotal: awayProjTotal,
      });
      teamProjections.push({
        id: currentMatchups[i].home.teamId,
        name: teamMap[currentMatchups[i].home.teamId].name,
        projectedTotal: homeProjTotal,
      });
    }

    console.log(teamProjections);
    return teamProjections;
  } catch (err) {
    console.error(err);
  }
}

module.exports = (app) => {
  app.get('/api/projections', (req, res) => {
    res.send(getWeeklyProjections());
  });
};
