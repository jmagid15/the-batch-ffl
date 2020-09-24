import React from 'react';
import ReactMarkdown from 'react-markdown';

import PorchV1 from '../reports/the-porch-volume-1.md';

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = { markdown: '' };
  }

  componentDidMount() {
    // Get the contents from the Markdown file and put them in the React state, so we can reference it in render() below.
    fetch(PorchV1)
      .then((res) => res.text())
      .then((text) => this.setState({ markdown: text }));
  }

  render() {
    return (
      <div className="report-view">
        <div className="report-doc">
          <ReactMarkdown source={this.state.markdown} />
        </div>
      </div>
    );
  }
}

export default Reports;
