const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('123,1233,211,222');
});

require('./routes/teams')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
