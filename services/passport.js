const passropt = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('users');

passropt.serializeUser((user, done) => {
    // user.id is not the profile.id. this is the unique key of the user record form mongo "_id".
    done(null, user.id);
});

passropt.deserializeUser((id, done) => {
    
    User.findById(id).then(user => {
        done(null, user);
    });

}); 

// console.developers.google.com
passropt.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {

    User.findOne({ googleId: profile.id }).then(existingUser => {
        if(existingUser) {
            // exist
            // we have to provide two arguments into the 'done'. ¬
            // A first argument is an error object. A second argument is a user record.
            done(null, existingUser);
        } else {
            new User({ googleId: profile.id}).save().then(user => {
                done(null, user);
            });
        }
    });

}));