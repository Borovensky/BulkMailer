const passropt = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
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

// google oauth
// console.developers.google.com
passropt.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
},  async (accessToken, refreshToken, profile, done) => {

    const existingUser = await User.findOne({ googleId: profile.id });

    if(existingUser) {
        // exist
        // we have to provide two arguments into the 'done'. ¬
        // A first argument is an error object. A second argument is a user record.
        return done(null, existingUser);
    }
    
    const user = await new User({ googleId: profile.id}).save()
    done(null, user);


}));

// facebook oauth
// developers.facebook.com
passropt.use(new FacebookStrategy({
    clientID: keys.facebookClientID,
    clientSecret: keys.facebookClientSecret,
    callbackURL: '/auth/facebook/callback'
}, accessToken => {
    console.log(accessToken);
}));