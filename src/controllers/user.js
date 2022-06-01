import jwt from 'jsonwebtoken';
import config from '../config';
import _ from 'lodash';
import mongoose from 'mongoose';
import passport from 'passport';

require('../models/user');
require('../utils/passport');

const User = mongoose.model('users');

function check_requiredFields(user) {
  if (!user.username) {
    return { username: 'can\'t be blank' };
  }
  if (!user.password) {
    return { password: 'can\'t be blank' };
  }
  return '';
}

export default {
  signin(req, res, next) {
    if (!req.body.user || _.size(req.body.user) !== 2) {
      return res.sendStatus(400);
    }
    let check = check_requiredFields(req.body.user);
    if (check !== '') {
      return res.status(422).json({ errors: check });
    }
    console.log('sign in');
    passport.authenticate('local', { session: false }, function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (user) {
        console.log('user:', user);
        user.token = user.generateJWT();
        return res.status(200).json({ user: user.toAuthJSON() });
      } else {
        console.log('error:', info);
        return res.status(422).json(info);
      }
    })(req, res, next);
  },
  all(req, res) {
    console.log('Fetching all users . . .');
    User.find({}).then(function(users) {
      if (users)
        return res.status(200).json(users);
      return res.status(404).json({ msg: 'no users found' });
    }, err => {
      console.log(err);
      return res.status(400).json({ msg: 'ERROR!!! While fetching users.' });
    });

  },
  signup(req, res, next) {
    if (!req.body.user || _.size(req.body.user) !== 2) {
      return res.sendStatus(400);
    }
    let check = check_requiredFields(req.body.user);
    if (check !== '') {
      return res.status(422).json({ errors: check });
    }
    console.log('Creating User . . . ');
    let user = new User();
    user.username = req.body.user.username;
    user.setPassword(req.body.user.password);

    user.save().then(() => {
      return res.status(201).json({ user: user.toAuthJSON() });
    }, err => {
      console.log(err);
      return res.status(400).json({ msg: 'ERROR!!! While creating users.' });
    }).catch(next);
  },
  one(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }
      console.log('Fetching a user');
      return res.status(200).json({ user: user.toAuthJSON() });
    }).catch(next);
  },
  update(req, res,next) {
    if (typeof req.body.user.status !== 'undefined'){
      User.findByIdAndUpdate(req.payload.id, { status: req.body.user.status },
        function (err) {
          if (err){
            return res.sendStatus(401);
          }
          else{
            User.findById(req.payload.id).then(function(user) {
              if (!user) {
                return res.sendStatus(401);
              }
              return res.status(200).json({ user: user.toAuthJSON() });
            }).catch(next);
          }
        });
    }else{
      return res.sendStatus(400);
    }
  }, delete(req, res) {
    User.findByIdAndRemove(req.payload.id,
      function (err) {
        if (err){
          return res.sendStatus(401);
        }
        else{
          return res.sendStatus(204);
        }
      });
  }
};
