import React from 'react';
import axios from 'axios';
import WeeklyScorersTable from './WeeklyScorersTable';
import LeagueStandings from './LeagueStandings';
import { H1, H3, H4, Popover, Menu, MenuItem, Button, Position } from '@blueprintjs/core';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedWeek: 0,
      maxWeek: 0
    }
  }

  componentDidMount() {
    this.getWeek();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.season !== this.props.season) {
      this.getWeek();
    }
  }

  getWeek = async () => {
    const res = await axios.get(`/api/${this.props.season}/currentweek/`);
    let selectedWeek = res.data.week;
    let maxWeek = res.data.maxWeek;

    if (selectedWeek > maxWeek) {
      selectedWeek = maxWeek;
    }

    this.setState({ selectedWeek, maxWeek });
  }

  handleClick = (idx) => {
    this.setState({ selectedWeek: idx })
  }

  render() {
    const weekList = Array.from({ length: this.state.maxWeek }, (_, i) => i + 1);

    const weekMenu = (
      <Menu>
        {weekList.map((name) => {
          return <MenuItem key={name} text={`Week ${name}`} onClick={() => { this.handleClick(name) }} />;
        })}
      </Menu>
    )

    return (
      <div>
        <div className="page-header">
          <H1>The Batch {this.props.season}</H1>
          <H4>Fantasy Football Dashboard</H4>
          <Popover content={weekMenu} position={Position.TOP} modifiers={{ preventOverflow: { enabled: true } }}>
            <Button text={`Week  ${this.state.selectedWeek}`} icon="calendar" />
          </Popover>
        </div>
        <div className="scoreboard-container">
          <div className="table-container">
            <H3>Weekly Top Scorers</H3>
            <i>Updates every 10s</i>
            <WeeklyScorersTable week={this.state.selectedWeek} scoresList={[]} season={this.props.season} />
          </div>
          <div className="table-container">
            <H3>Regular Season Standings</H3>
            <i>Updates after each week</i>
            <LeagueStandings season={this.props.season} />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
