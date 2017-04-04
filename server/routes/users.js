const express = require('express');
const router = express.Router();
const mongo = require('../model/db');
const dbConfig = mongo.config;
const jwt = require('jsonwebtoken');
// login page
router.get('/login', (req, res, next)=>{
  res.render('login');
});
// login
router.post('/login', (req, res, next)=>{
  if (req.body.email && req.body.password) {
    mongo.db.collection(dbConfig.collUsers).findOne({email: req.body.email})
    .then(user=>{
      // console.log(JSON.stringify(user));
      // user not found
      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else {
        // wrong password
        if (user.password !== req.body.password) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        // success
        } else {
          const token = jwt.sign(user, req.app.get('secret'));
          // const token = jwt.sign(user, app.get('secret'), {expiresInMinutes: 1440});
          res.json({ success: true, message: 'Authentication success.', token: token });
        }
      }
    })
    .catch(err=>{
      console.log(`POST /login err: ${err}`);
    });
  } else {
    res.json({ success: false, message: 'Authentication failed. No user or password' });
  }
});
// sign up
router.post('/sign-up', (req, res, next)=>{
  if (req.body.email && req.body.password) {
    const user = {
      email: req.body.email,
      password: req.body.password,
      admin: false
    };
    mongo.db.collection(dbConfig.collUsers).insertOne(user)
    .then(res=>{
      res.json('result: true');
    })
    .catch(err=>{
      res.json('result: false');
      console.log(`sign-up-error: ${err}`);
    });
  }
  // req.session.email = req.body.email;
  // console.log(`req.body: ${JSON.stringify(req.body)}`);
  // console.log(`session: ${JSON.stringify(req.session)}`);
  // res.json('status: success');
});
// token parse
router.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, req.app.get('secret'), function (err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  // no token received
  } else {
    return res.status(403).send({success: false, message: 'No token provided.' });
  }
});
// test
router.get('/test', (req, res, next)=>{
  console.log(`session: ${JSON.stringify(req.session)}`);
  const sess = req.session;
  let user = 'no user';
  if (sess.email) {
    user = sess.email;
  }
  res.render('test', {user: user});
});
module.exports = router;
