const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const {FACE_BOOK} = require('./config').OAUTH
passport.serializeUser(function (user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });

  passport.use(new FacebookStrategy({
      clientID: FACE_BOOK.CLIENT_ID,
      clientSecret: FACE_BOOK.CLIENT_SECRET,
      callbackURL: FACE_BOOK.CALLBACK_URL
    }, function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  ));
  module.exports = passport;