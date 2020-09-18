import React from 'react';

const LeagueStandings = ({ standings }) => {
  return (
    <table className="bp3-html-table">
      <thead>
        <tr>
          <th>Ranking</th>
          <th>Team</th>
          <th>Record</th>
          <th>Overall Points</th>
        </tr>
      </thead>
      <tbody>
        {standings.length > 0 ? (
          standings.map((s, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{s.name}</td>
                <td>{`${s.totalWins} - ${s.totalLosses}`}</td>
                <td>{s.seasonPoints}</td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="4">Loading...</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default LeagueStandings;
