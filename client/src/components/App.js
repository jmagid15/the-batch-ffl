import React from 'react';
import axios from 'axios';
import WeeklyScorersTable from './WeeklyScorersTable';
import { H1, H3, H4 } from '@blueprintjs/core';
import LeagueStandings from './LeagueStandings';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scoresList: [],
      standingList: [],
    };
  }

  componentDidMount() {
    this.getScores();
    this.getStandings();
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
    return;
  };

  getStandings = async () => {
    const standings = await axios.get('/api/standings');
    this.setState({ standingList: standings.data });
  };

  render() {
    return (
      <div>
        <div className="page-header">
          <H1>The Batch 2020</H1>
          <H4>Fantasy Football Dashboard</H4>
        </div>
        <div className="scoreboard-container">
          <div className="table-container">
            <H3>Weekly Top Scorers</H3>
            <i>Updates every 10s</i>
            <WeeklyScorersTable
              score={this.state.scoresList}
            ></WeeklyScorersTable>
          </div>
          <div className="table-container">
            <H3>League Standings</H3>
            <i>Updates after each week</i>
            <LeagueStandings
              standings={this.state.standingList}
            ></LeagueStandings>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
