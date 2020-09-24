import React from 'react';
import axios from 'axios';

class LeagueStandings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      standingList: [],
    };
  }

  componentDidMount() {
    this.getStandings();
  }

  getStandings = async () => {
    const standings = await axios.get('/api/standings');
    this.setState({ standingList: standings.data });
  };

  render() {
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
          {this.state.standingList.length > 0 ? (
            this.state.standingList.map((s, index) => {
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
  }
}

export default LeagueStandings;
