const axios = require('axios');
const express = require('express');

const ESPN_API_BASE = "https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/"

async function getTeams(season) {
  try {
    const rsp = await axios.get(
      ESPN_API_BASE + `${season}/segments/0/leagues/319300?view=mTeam`
    );
    const teamMap = {};
    const teams = rsp.data.teams;
    for (i in teams) {
      teamMap[teams[i].id] = {
        name: teams[i].name,
        // Using division since overall combines bonus wins if that's enabled
        h2hwins: teams[i].record.division.wins,
        h2hlosses: teams[i].record.division.losses,
        seasonPoints: teams[i].record.overall.pointsFor.toFixed(2),
      };
    }
    return teamMap;
  } catch (err) {
    console.error(err);
  }
}


function enterScores(scores, scheduleEntry, teamMap, liveFlag) {
  // Accounting for bye games first week of playoffs
  if ("away" in scheduleEntry) {
    if (liveFlag) {
      scores[scheduleEntry.away.teamId] = {
        team: teamMap[scheduleEntry.away.teamId].name,
        points: scheduleEntry.away.totalPointsLive.toFixed(2),
        id: scheduleEntry.away.teamId,
      };
    } else {
      scores[scheduleEntry.away.teamId] = {
        team: teamMap[scheduleEntry.away.teamId].name,
        points: scheduleEntry.away.totalPoints.toFixed(2),
        id: scheduleEntry.away.teamId,
      };
    }
  }
  if ("home" in scheduleEntry) {
    if (liveFlag) {
      scores[scheduleEntry.home.teamId] = {
        team: teamMap[scheduleEntry.home.teamId].name,
        points: scheduleEntry.home.totalPointsLive.toFixed(2),
        id: scheduleEntry.home.teamId,
      };
    } else {
      scores[scheduleEntry.home.teamId] = {
        team: teamMap[scheduleEntry.home.teamId].name,
        points: scheduleEntry.home.totalPoints.toFixed(2),
        id: scheduleEntry.home.teamId,
      };
    }
  }

  return scores;
}


async function getTopScorers(season, wk) {
  const teamMap = await getTeams(season);
  try {
    const rsp = await axios.get(
      ESPN_API_BASE + `${season}/segments/0/leagues/319300?view=mMatchupScore`
    );
    const schedule = rsp.data.schedule;

    // Set week to current scoring period if 0, or last week of regular season (13)
    var liveFlag = false;
    if (wk == rsp.data.scoringPeriodId) {
      liveFlag = true;
    } else if (wk == 0) {
      // Set to current week
      wk = rsp.data.scoringPeriodId;
      liveFlag = true;
    }

    // Populate scores from specified week
    var scores = {};
    for (i in schedule) {
      if (schedule[i].matchupPeriodId == wk) {
        scores = enterScores(scores, schedule[i], teamMap, liveFlag);
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
  if (parseFloat(b['points']) > parseFloat(a['points'])) return 1;
  if (parseFloat(a['points']) > parseFloat(b['points'])) return -1;

  return 0;
}

function compareRecords(a, b) {
  if (
    b['totalWins'] * 10 + b['totalLosses'] * 1 >
    a['totalWins'] * 10 + a['totalLosses'] * 1
  ) {
    return 1;
  }
  if (
    a['totalWins'] * 10 + a['totalLosses'] * 1 >
    b['totalWins'] * 10 + b['totalLosses'] * 1
  ) {
    return -1;
  }
  if (parseFloat(b['seasonPoints']) > parseFloat(a['seasonPoints'])) {
    return 1;
  }
  if (parseFloat(a['seasonPoints']) > parseFloat(b['seasonPoints'])) {
    return -1;
  }
  return 0;
}

async function getCurrentStandings(season) {
  const teamMap = await getTeams(season);
  try {
    // 1. for each week up to scoringPeriodId, compute pts winners and losers. add them to teamMap
    // 2. sum pts W/L with h2h W/L
    // 3. sort
    const rsp = await axios.get(
      ESPN_API_BASE + `${season}/segments/0/leagues/319300?view=mMatchupScore`
    );
    const currentWeek = rsp.data.scoringPeriodId;
    const schedule = rsp.data.schedule;
    
    // Define regular season cutoff week
    var regSeasonCutoffWeek;
    if (season == '2020') {
      regSeasonCutoffWeek = 14;
    } else {
      regSeasonCutoffWeek = 15;
    }
    
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
      var weeklyScores = await getTopScorers(season, i);
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

async function getCurrentWeek(season) {
  const rsp = await axios.get(
    ESPN_API_BASE + `${season}/segments/0/leagues/319300`
  );
  const currentWeek = rsp.data.scoringPeriodId;
  const maxWeek = rsp.data.status.currentMatchupPeriod;
  res = {
    week: currentWeek,
    maxWeek: maxWeek
  };
  return res;
}

exports.getTeams = getTeams;
exports.getTopScorers = getTopScorers;
exports.getCurrentStandings = getCurrentStandings;
exports.convertToCSV = convertToCSV;
exports.getCurrentWeek = getCurrentWeek;
