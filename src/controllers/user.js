import jwt from 'jsonwebtoken';
import config from '../config';
import _ from 'lodash';
import mongoose from 'mongoose';
import passport from 'passport';

require('../models/user');
require('../utils/passport');

const { secretKey } = config;
const User = mongoose.model('users');

function check_requiredFields(req) {
  if (!req.body.username) {
    return { username: 'can\'t be blank' };
  }
  if (!req.body.password) {
    return { password: 'can\'t be blank' };
  }
  return '';
}

export default {
  signin(req, res, next) {
    if (_.size(req.body) !== 2) {
      return res.sendStatus(400);
    }
    let check = check_requiredFields(req);
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
        return res.json({ user: user.toAuthJSON() });
      } else {
        console.log('error:', info);
        return res.status(422).json(info);
      }
    })(req, res, next);
  },
  all(req, res) {
    res.status(200).json(users);
  },
  signup(req, res, next) {
    if (_.size(req.body) !== 2) {
      return res.sendStatus(400);
    }
    let check = check_requiredFields(req);
    if (check !== '') {
      return res.status(422).json({ errors: check });
    }
    console.log('Creating User . . . ');
    let user = new User();
    user.username = req.body.username;
    user.setPassword(req.body.password);

    user.save().then(
      () => {
        return res.status(200).json({ user: user.toAuthJSON() });
      },
      err => {
        console.log(err);
        return res.status(400).json({ msg: 'ERROR!!! While creating users.' });
      }
    ).catch(next);
  },
  one(req, res) {
    let name;
    try {
      name = req.params.name;
      if (req.user.role !== Role.Admin && name !== req.user.name) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      const index = users.findIndex((e) => e.name === name);
      if (index !== -1) {
        console.log('users found');
        res.status(200).json(users[index]);
      } else {
        console.log('users not found');
        res.sendStatus(404);
      }
    } catch (e) {
      console.log(e);
      res.status(400).json(`ERROR!!! While getting user with name: ${name}`);
    }
  },
  update(req, res) {
    let name;
    try {
      name = req.params.name;
      if (req.user.role !== Role.Admin && name !== req.user.name) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      const index = users.findIndex((e) => e.name === name);
      if (index !== -1) {
        console.log('users found, now updating the users . . . ');
        const updated = {
          name,
          email: req.body.email,
          password: req.body.password,
          role: users[index].role
        };
        users.splice(index, 1, updated);
        res.sendStatus(204);
      } else {
        console.log('users not found to update');
        res.sendStatus(404);
      }
    } catch (e) {
      console.log(e);
      res.status(400).json(`ERROR!!! While updating user with name: ${name}`);
    }
  },
  delete(req, res) {
    let name;
    try {
      name = req.params.name;
      if (req.user.role !== Role.Admin && name !== req.user.name) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      const index = users.findIndex((e) => e.name === name);
      if (index !== -1) {
        console.log('Deleting users . . . ');
        users.splice(index, 1);
        res.sendStatus(204);
      } else {
        console.log('users not found to delete');
        res.sendStatus(404);
      }
    } catch (e) {
      console.log(e);
      res.status(400).json(`ERROR!!! While deleting user with name: ${name}`);
    }
  }
};
