import passport from 'passport';
import passport_local from 'passport-local';
import mongoose from 'mongoose';

const User = mongoose.model('users');

const LocalStrategy = passport_local.Strategy;


passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }).then(function(user) {
    if (!user || !user.validatePassword(password)) {
      return done(null, false, { errors: { 'username or password': 'is invalid' } });
    }

    return done(null, user);
  }).catch(done);
}));

