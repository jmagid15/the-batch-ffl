const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send("You shouldn't be here");
});

require('./routes/teamsRoutes')(app);
require('./routes/scoresRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
