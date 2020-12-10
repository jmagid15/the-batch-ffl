const axios = require('axios');
const express = require('express');

async function getTeams() {
  try {
    const rsp = await axios.get(
      'https://fantasy.espn.com/apis/v3/games/ffl/seasons/2020/segments/0/leagues/319300?view=mTeam'
    );
    const teamMap = {};
    const teams = rsp.data.teams;
    for (i in teams) {
      teamMap[teams[i].id] = {
        name: teams[i].location + ' ' + teams[i].nickname,
        h2hwins: teams[i].record.overall.wins,
        h2hlosses: teams[i].record.overall.losses,
        seasonPoints: teams[i].record.overall.pointsFor.toFixed(2),
      };
    }
    return teamMap;
  } catch (err) {
    console.error(err);
  }
}

async function getTopScorers(wk) {
  const teamMap = await getTeams();
  try {
    const rsp = await axios.get(
      'https://fantasy.espn.com/apis/v3/games/ffl/seasons/2020/segments/0/leagues/319300?view=mMatchupScore'
    );
    const schedule = rsp.data.schedule.slice(0, 13*5);

    // Set week to current scoring period if 0, or last week of regular season (13)
    var liveFlag = false;
    if (wk == rsp.data.scoringPeriodId) {
      // If wk !=0 this is a deliberate request to the topscorers/:week endpoint
      liveFlag = true;
    } else if (wk == 0 && rsp.data.scoringPeriodId > 13) {
      // End of regular season - show week 13
      wk = 13;
    } else if (wk == 0) {
      // Live during regular season
      wk = rsp.data.scoringPeriodId;
      liveFlag = true;
    }

    var scores = {};
    for (i in schedule) {
      if (wk == schedule[i].matchupPeriodId) {
        if (liveFlag) {
          scores[schedule[i].away.teamId] = {
            team: teamMap[schedule[i].away.teamId].name,
            points: schedule[i].away.totalPointsLive,
            id: schedule[i].away.teamId,
          };
          scores[schedule[i].home.teamId] = {
            team: teamMap[schedule[i].home.teamId].name,
            points: schedule[i].home.totalPointsLive,
            id: schedule[i].home.teamId,
          };
        } else {
          scores[schedule[i].away.teamId] = {
            team: teamMap[schedule[i].away.teamId].name,
            points: schedule[i].away.totalPoints,
            id: schedule[i].away.teamId,
          };
          scores[schedule[i].home.teamId] = {
            team: teamMap[schedule[i].home.teamId].name,
            points: schedule[i].home.totalPoints,
            id: schedule[i].home.teamId,
          };
        }
      }
    }

    // Sort the scores
    const sortedScoresArray = [];
    for (i in scores) {
      sortedScoresArray.push(scores[i]);
    }
    sortedScoresArray.sort(comparePoints);
    scores = {};
    for (i in sortedScoresArray) {
      scores[i] = sortedScoresArray[i];
    }
    return scores;
  } catch (err) {
    console.error(err);
  }
}

function comparePoints(a, b) {
  if (b['points'] > a['points']) return 1;
  if (a['points'] > b['points']) return -1;

  return 0;
}

function compareRecords(a, b) {
  if (
    b['totalWins'] * 3 + b['totalLosses'] * -1 >
    a['totalWins'] * 3 + a['totalLosses'] * -1
  )
    return 1;
  if (
    a['totalWins'] * 3 + a['totalLosses'] * -1 >
    b['totalWins'] * 3 + b['totalLosses'] * -1
  )
    return -1;

  if (b['seasonPoints'] > a['seasonPoints']) return 1;
  if (a['seasonPoints'] > b['seasonPoints']) return -1;
  return 0;
}

async function getCurrentStandings() {
  const teamMap = await getTeams();
  try {
    // 1. for each week up to scoringPeriodId, compute pts winners and losers. add them to teamMap
    // 2. sum pts W/L with h2h W/L
    // 3. sort
    const rsp = await axios.get(
      'https://fantasy.espn.com/apis/v3/games/ffl/seasons/2020/segments/0/leagues/319300?view=mMatchupScore'
    );
    const currentWeek = rsp.data.scoringPeriodId;
    const regSeasonCutoffWeek = 14;
    const winnerCutoff = 5;

    // Initialize ptsRecordMap
    const ptsRecordMap = {};
    for (k of Object.keys(teamMap)) {
      ptsRecordMap[k] = {
        ptswins: 0,
        ptslosses: 0,
      };
    }
    for (var i = 1; i < Math.min(regSeasonCutoffWeek, currentWeek); i++) {
      var weeklyScores = await getTopScorers(i);
      for (var j = 0; j < Object.keys(weeklyScores).length; j++) {
        if (j < winnerCutoff) {
          ptsRecordMap[weeklyScores[j].id].ptswins += 1;
        } else {
          ptsRecordMap[weeklyScores[j].id].ptslosses += 1;
        }
      }
    }

    // Sum points W/L with H2H W/L
    const teamStandings = {};
    for (k of Object.keys(teamMap)) {
      teamStandings[k] = {
        name: teamMap[k].name,
        id: k,
        totalWins: teamMap[k].h2hwins + ptsRecordMap[k].ptswins,
        totalLosses: teamMap[k].h2hlosses + ptsRecordMap[k].ptslosses,
        seasonPoints: teamMap[k].seasonPoints,
      };
    }

    // Sort teams based on record
    const sortedRecordArray = [];
    for (i of Object.keys(teamStandings)) {
      sortedRecordArray.push(teamStandings[i]);
    }
    sortedRecordArray.sort(compareRecords);

    return sortedRecordArray;
  } catch (err) {
    console.error(err);
  }
}

function convertToCSV(jsonData) {
  jsonData = Object.values(jsonData);
  var csvData = '';
  var keys = (jsonData[0] && Object.keys(jsonData[0])) || [];
  csvData += keys.join(',') + '\n';
  for (i in jsonData) {
    csvData += Object.values(jsonData[i]).join(',');
    csvData += '\n';
  }
  return csvData;
}

exports.getTeams = getTeams;
exports.getTopScorers = getTopScorers;
exports.getCurrentStandings = getCurrentStandings;
exports.convertToCSV = convertToCSV;
