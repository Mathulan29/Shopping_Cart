const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then((user) => done(null, user));
    });

    // Google Strategy
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                const newUser = {
                    googleId: profile.id,
                    // displayName: profile.displayName,
                    // firstName: profile.name.givenName,
                    // lastName: profile.name.familyName,
                    // image: profile.photos[0].value,
                    email: profile.emails[0].value,
                };

                try {
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        done(null, user);
                    } else {
                        // Check if user exists with same email, if so, link accounts or error
                        user = await User.findOne({ email: profile.emails[0].value });

                        if (user) {
                            // Link account
                            user.googleId = profile.id;
                            await user.save();
                            done(null, user);
                        } else {
                            user = await User.create(newUser);
                            done(null, user);
                        }
                    }
                } catch (err) {
                    console.error(err);
                    done(err, null);
                }
            }
        )
    );

    // Facebook Strategy
    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
                callbackURL: '/api/auth/facebook/callback',
                profileFields: ['id', 'displayName', 'photos', 'email'],
            },
            async (accessToken, refreshToken, profile, done) => {
                // Note: Facebook email might be missing if user didn't grant permission or signed up with phone
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `fb_${profile.id}@facebook.com`;

                const newUser = {
                    facebookId: profile.id,
                    email: email
                };

                try {
                    let user = await User.findOne({ facebookId: profile.id });

                    if (user) {
                        done(null, user);
                    } else {
                        // Check email
                        user = await User.findOne({ email: email });
                        if (user) {
                            user.facebookId = profile.id;
                            await user.save();
                            done(null, user);
                        } else {
                            user = await User.create(newUser);
                            done(null, user);
                        }
                    }
                } catch (err) {
                    console.error(err);
                    done(err, null);
                }
            }
        )
    );
};
