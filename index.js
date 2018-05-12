const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongodbURI); 

const app = express();

// app.use middleware
app.use(bodyParser.json());

app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());
// ======

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);

// handle Express in the production environment.
if(process.env.NODE_ENV === 'production') {
    //Express will serve up production assets like our main.js file, or main.css file!
    app.use(express.static('client/build'));

    //Express will serve up the index.js file if it doesn't recognize the route.
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// process.env.PORT --- will automatically defined by HEROKU 
const PORT = process.env.PORT || 5000;
app.listen(PORT);