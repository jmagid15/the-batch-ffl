import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './Home';
import Reports from './Reports';
import { Navbar, Alignment, Button, Popover, Menu, MenuItem, Position } from '@blueprintjs/core';

const SEASONS = [
  2024,
  2023,
  2022,
  2021,
  2020,
]

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSeason: SEASONS[0]
    }
  }

  handleClick = (szn) => {
    this.setState({ selectedSeason: szn })
  }

  render() {
    const seasonMenu = (
      <Menu>
        {SEASONS.map((szn) => {
          return <MenuItem key={szn} text={szn} onClick={() => { this.handleClick(szn) }} />;
        })}
      </Menu>
    )

    return (
      <Router>
        <div className="bp3-dark dark-container">
          <Navbar>
            <Navbar.Group align={Alignment.LEFT}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Button className="bp3-minimal" icon="home" text="The Batch" />
              </Link>
              <Link to="/reports" style={{ textDecoration: 'none', color: 'inherit' }} >
                <Button className="bp3-minimal" icon="document" text="The Porch" />
              </Link>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
              <Popover content={seasonMenu} position={Position.TOP} modifiers={{ preventOverflow: { enabled: true } }}>
                <Button className="bp3-minimal" icon="menu" text="Season" />
              </Popover>
            </Navbar.Group>
          </Navbar>
          <Switch>
            <Route exact path="/">
              <Home season={this.state.selectedSeason} />
            </Route>
            <Route path="/reports">
              <Reports season={this.state.selectedSeason}/>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
