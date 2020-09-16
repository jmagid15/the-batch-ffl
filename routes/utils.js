const axios = require('axios');

const getTeams = async function getTeams() {
  console.log('teams gathering');
  try {
    const rsp = await axios.get(
      'http://fantasy.espn.com/apis/v3/games/ffl/seasons/2020/segments/0/leagues/319300?view=mTeam'
    );
    const teamMap = {};
    const teams = rsp.data.teams;
    for (i in teams) {
      teamMap[teams[i].id] = teams[i].location + ' ' + teams[i].nickname;
    }
    return teamMap;
  } catch (err) {
    console.error(err);
  }
};

const convertToCSV = function toCSV(jsonData) {
  jsonData = Object.values(jsonData);
  var csvData = '';
  var keys = (jsonData[0] && Object.keys(jsonData[0])) || [];
  csvData += keys.join(',') + '\n';
  for (i in jsonData) {
    csvData += Object.values(jsonData[i]).join(',');
    csvData += '\n';
  }
  return csvData;
};

exports.getTeams = getTeams;
exports.convertToCSV = convertToCSV;
