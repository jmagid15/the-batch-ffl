import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './Home';
import Reports from './Reports';

import { Navbar, Alignment, Button } from '@blueprintjs/core';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="bp3-dark dark-container">
          <Navbar>
            <Navbar.Group align={Alignment.LEFT}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Button className="bp3-minimal" icon="home" text="The Batch" />
              </Link>
              <Link
                to="/reports"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Button
                  className="bp3-minimal"
                  icon="document"
                  text="The Porch"
                />
              </Link>
            </Navbar.Group>
          </Navbar>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/reports">
              <Reports />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
