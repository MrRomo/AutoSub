'use strict';

const express = require('express');
const env = require('../config');
const User = require('../models/User')

// [START setup]
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

function extractProfile(profile) {
    let imageUrl = '';
    if (profile.photos && profile.photos.length) {
        imageUrl = profile.photos[0].value;
    }
    return {
        id: profile.id,
        name: profile.displayName,
        username: profile.displayName.split(' ')[0].toLowerCase(),
        image: imageUrl,
        email: profile.emails[0].value
    };
}

// Configure the Google strategy for use by Passport.js.
//
// OAuth 2-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Google API on the user's behalf,
// along with the user's profile. The function must invoke `cb` with a user
// object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new GoogleStrategy({
    clientID: env.clientId,
    clientSecret: env.secret,
    callbackURL: env.callback,
    accessType: 'offline'
}, (accessToken, refreshToken, profile, cb) => {
    // Extract the minimal profile information we need from the profile object
    // provided by Google
    cb(null, extractProfile(profile));
}))

passport.serializeUser((user, cb) => {
    cb(null, user);
});
passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});
// [END setup]

const router = express.Router();

// [START middleware]
// Middleware that requires the user to be logged in. If the user is not logged
// in, it will redirect the user to authorize the application and then return
// them to the original URL they requested.
function authRequired(req, res, next) {
    if (!req.user) {
        req.session.oauth2return = req.originalUrl;
        return res.redirect('/');
    }
    next();
}

// Middleware that exposes the user's profile as well as login/logout URLs to
// any templates. These are available as `profile`, `login`, and `logout`.
function addTemplateVariables(req, res, next) {
    res.locals.profile = req.user;
    res.locals.login = `/login?return=${encodeURIComponent(req.originalUrl)}`;
    res.locals.logout = `/logout?return=${encodeURIComponent(req.originalUrl)}`;
    next();
}
// [END middleware]

// Begins the authorization flow. The user will be redirected to Google where
// they can authorize the application to have access to their basic profile
// information. Upon approval the user is redirected to `/auth/google/callback`.
// If the `return` query parameter is specified when sending a user to this URL
// then they will be redirected to that URL when the flow is finished.
// [START authorize]
router.get('/login',

    // Save the url of the user's current page so the app can redirect back to
    // it after authorization
    (req, res, next) => {
        if (req.query.return) {
            req.session.oauth2return = req.query.return;
        }
        next();
    },
    passport.authenticate('google', { scope: ['email', 'profile'] })
);
// [END authorize]

// [START callback]
router.get('/callback',
    passport.authenticate('google'),
    async (req, res) => {
        const redirect = req.session.oauth2return || '/';
        delete req.session.oauth2return;
        const query = req.session.passport.user
        const {username} = query
        const user = await db.get({ "id": query.id }, User)
        console.log('user signed',user);

        if (!user.data.length) {
            let number = 0;
            let response
            do {
                response = await db.create(query, User)
                query.username = `${username}${number}`
                number++
                console.log('Try ', query.username);
                console.log('catch', response);
                
            } while (response.error);
            query.username = response.data.username
            console.log('user created:',response.data);
        }else{
            await db.update({query:{id:user.data[0].id}, options:{'lastSign':Date.now()}}, User)
        }
        res.redirect('/jobs')

    }
);
// [END callback]

// Deletes the user's credentials and profile from the session.
// This does not revoke any active tokens.
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = {
    extractProfile: extractProfile,
    router: router,
    required: authRequired,
    template: addTemplateVariables
};