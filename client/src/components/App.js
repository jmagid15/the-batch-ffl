import React from 'react';
import axios from 'axios';
import WeeklyScorersTable from './WeeklyScorersTable';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scoresList: [],
    };
  }

  componentDidMount() {
    this.getScores();
  }

  getScores = async () => {
    const scores = await axios.get('/api/topscorers/');
    const scoresList = Object.values(scores.data);
    this.setState({ scoresList: scoresList });
    return;
  };

  render() {
    return (
      <div>
        <h1>Hi there</h1>
        <h2>Weekly Top Scorers</h2>
        <WeeklyScorersTable score={this.state.scoresList}></WeeklyScorersTable>
      </div>
    );
  }
}

export default App;
