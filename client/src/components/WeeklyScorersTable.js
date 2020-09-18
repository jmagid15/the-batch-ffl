import React from 'react';

const WeeklyScorersTable = ({ score }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Team</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {score.length > 0 ? (
          score.map((s, index) => {
            return (
              <tr key={index}>
                <td>{s.Team}</td>
                <td>{s.Points}</td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="2">Loading...</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default WeeklyScorersTable;
