import React from 'react';
import ReactMarkdown from 'react-markdown';
import author from '../images/author.png';
import * as Vols from '../reports';
import { H5, Tabs, Tab } from '@blueprintjs/core';

const VOLUMES = {
  2020: {
    1: Vols.Porch2020v1,
    2: Vols.Porch2020v2,
  },
  2021: {
    1: Vols.Porch2021v1,
  },
  2022: {
    1: Vols.Porch2022v1,
  },
  2023: {
    1: Vols.Porch2023v1,
  },
  2024: {
    1: Vols.Porch2024v1,
  },
  2025: {
    1: Vols.Porch2025v1,
  },
}

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markdown: '',
      mostRecentReport: Object.keys(VOLUMES[this.props.season]).length,
      volumes: VOLUMES[this.props.season],
      windowDimensions: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };
  }

  componentDidMount() {
    this.getMarkdown(this.state.mostRecentReport);
    this.setState({ selectedTab: this.state.mostRecentReport });
    // Detect when window has been resized
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.season !== this.props.season) {
      let maxVol = Object.keys(VOLUMES[this.props.season]).length;
      this.setState({
        mostRecentReport: maxVol,
        selectedTab: maxVol,
        volumes: VOLUMES[this.props.season],
      }, () => {
        this.getMarkdown(this.state.mostRecentReport);
      });
    }
  }

  getMarkdown(idx) {
    // Get the contents from the Markdown file and put them in the React state, so we can reference it in render() below.
    fetch(this.state.volumes[idx])
      .then((res) => res.text())
      .then((text) => this.setState({ markdown: text }));
  }

  handleTabChange = (newTabId, _prevTabId) => {
    this.getMarkdown(newTabId);
    this.setState({ selectedTab: newTabId });
  };

  updateWindowDimensions = () => {
    this.setState({
      ...this.state,
      windowDimensions: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });
  };

  render() {
    return (
      <div className="report-view">
        <div className="report-nav">
          <h2>{`${this.props.season} Edition`}</h2>
          <div className="tabs-container">
            <Tabs
              id="vol-tabs"
              vertical={this.state.windowDimensions.width > 620}
              selectedTabId={this.state.selectedTab}
              onChange={this.handleTabChange}
            >
              {Object.keys(this.state.volumes).map((k, _i) => {
                return (
                  <Tab id={k} key={k} title={`Volume ${k}`} className="tab-item" />
                )
              })}
            </Tabs>
          </div>
          <h2>About the author</h2>
          <img src={author} alt="Hoom" />
          <H5>I'm Horny</H5>
        </div>
        <div className="report-doc">
          <ReactMarkdown children={this.state.markdown} />
        </div>
      </div>
    );
  }
}

export default Reports;
