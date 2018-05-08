const passropt = require('passport');

module.exports = (app) => {

    // google auth routes
    app.get('/auth/google', passropt.authenticate('google', {
        scope: ['profile', 'email']
    }));
    
    app.get('/auth/google/callback', passropt.authenticate('google'));

    // facebook auth routes
    app.get('/auth/facebook', passropt.authenticate('facebook', {
        scope: ['email']
    }));

    app.get('/auth/facebook/callback', passropt.authenticate('facebook'));

    
    app.get('/api/logout', (req, res) => {
        // 'logout()' this is the staff from passport that kill the cookie.
        req.logout();
        res.send(req.user);
    });

    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });

};