import React from 'react';
import ReactMarkdown from 'react-markdown';

import author from '../images/author.png';
import { PorchV1, PorchV2 } from '../reports';
import { H5, Tabs, Tab } from '@blueprintjs/core';

class Reports extends React.Component {
  state = {
    markdown: '',
    mostRecentReport: 2,
    volumes: {
      1: PorchV1,
      2: PorchV2,
    },
    windowDimensions: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };

  componentDidMount() {
    // Get the contents from the Markdown file and put them in the React state, so we can reference it in render() below.
    fetch(this.state.volumes[this.state.mostRecentReport])
      .then((res) => res.text())
      .then((text) => this.setState({ markdown: text }));
    // Detect when window has been resized
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  handleTabChange = (newTabId, prevTabId) => {
    fetch(this.state.volumes[newTabId])
      .then((res) => res.text())
      .then((text) => this.setState({ markdown: text }));
  };

  updateWindowDimensions = () => {
    this.setState({
      ...this.state,
      windowDimensions: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });
    console.log(this.state.windowDimensions);
  };

  render() {
    return (
      <div className="report-view">
        <div className="report-nav">
          <div className="tabs-container">
            <Tabs
              id="vol-tabs"
              vertical={this.state.windowDimensions.width > 620}
              defaultSelectedTabId={this.state.mostRecentReport}
              onChange={this.handleTabChange}
            >
              <Tab id="1" title="Volume 1" className="tab-item" />
              <Tab id="2" title="Volume 2" className="tab-item" />
            </Tabs>
          </div>
          <h2>About the author</h2>
          <img src={author} alt="Hoom" />
          <H5>I'm Horny</H5>
        </div>
        <div className="report-doc">
          <ReactMarkdown source={this.state.markdown} />
        </div>
      </div>
    );
  }
}

export default Reports;
