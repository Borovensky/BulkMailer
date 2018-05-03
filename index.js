const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send({ hi: 'My man' });
});

// process.env.PORT --- will automatically defined by HEROKU 
const PORT = process.env.PORT || 5000;
app.listen(PORT);