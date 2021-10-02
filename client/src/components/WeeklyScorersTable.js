import React from 'react';
import axios from 'axios';
import { Spinner } from '@blueprintjs/core';

class WeeklyScorersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scoresList: [],
    };
  }

  componentDidMount() {
    this.getScores(this.props.week);
    this.timer = setInterval(() => this.getScores(this.props.week), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  getScores = async (wk) => {
    const scores = await axios.get(`/api/${this.props.season}/topscorers/${wk}`);
    const scoresList = Object.values(scores.data);
    this.setState({ scoresList: scoresList });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.scoresList !== this.props.scoresList) {
      this.setState({ scoresList: this.props.scoresList });
    }
  }

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
            <>
              <tr>
                <td colSpan="2" >
                  <Spinner />
                </td>
              </tr>
              <tr>
                <td colSpan="2" style={{ textAlign: "center" }}>Loading...</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    );
  }
}

export default WeeklyScorersTable;
