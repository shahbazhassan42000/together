import config from '../config';
import jwt from 'express-jwt';

function getTokenFromHeader(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
    req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
}

let auth = {
  required: jwt({
    secret: config.secretKey,
    userProperty: 'payload',
    getToken: getTokenFromHeader,
    algorithms: ['HS256']
  })
};

export default auth;
