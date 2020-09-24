import React from 'react';

import WeeklyScorersTable from './WeeklyScorersTable';
import LeagueStandings from './LeagueStandings';
import { H1, H3, H4 } from '@blueprintjs/core';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

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
            <WeeklyScorersTable />
          </div>
          <div className="table-container">
            <H3>League Standings</H3>
            <i>Updates after each week</i>
            <LeagueStandings />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
