import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, 'can\'t be blank'],
    match: [/^[a-zA-z\d]+$/, 'is invalid'],
    index: true
  },
  image: { type: String, default: '/src/static/images/profile_img.png' },
  status: { type: String, default: 'offline', match: [/^online|offline$/, 'is invalid'] },
  hash: String,
  salt: String

}, { timestamps: true });

userSchema.plugin(uniqueValidator);

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.validatePassword = function(password) {
  let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.toAuthJSON = function() {
  return {
    username: this.username,
    token: this.generateJWT(),
    image: this.image,
    status: this.status
  };
};

userSchema.methods.generateJWT = function() {
  let expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 60);
  return jwt.sign({
      username: this.username,
      expiryDate: parseInt(expiryDate.getTime() / 1000)
    }
    , config.secretKey);
};

mongoose.model('users', userSchema);

