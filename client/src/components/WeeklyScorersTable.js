import React from 'react';
import axios from 'axios';

class WeeklyScorersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scoresList: [],
    };
  }

  componentDidMount() {
    this.getScores();
    this.timer = setInterval(() => this.getScores(), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  getScores = async () => {
    const scores = await axios.get('/api/topscorers/');
    const scoresList = Object.values(scores.data);
    this.setState({ scoresList: scoresList });
  };

  render() {
    return (
      <table className="bp3-html-table weeklyScore">
        <thead>
          <tr>
            <th>Team</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {this.state.scoresList.length > 0 ? (
            this.state.scoresList.map((s, index) => {
              return (
                <tr key={index}>
                  <td>{s.team}</td>
                  <td>{s.points}</td>
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
  }
}

export default WeeklyScorersTable;
